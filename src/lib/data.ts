import "server-only";
import type { Catalog, CatalogImage, CatalogInventoryItem, Category, SiteSettings, Warehouse } from "./types";
import seed from "./seed-catalogs.json";
import categoriesSeed from "./seed-categories.json";
import { getSupabaseClient } from "./supabase/client";
import warehousesSeed from "./seed-warehouses.json";
import legacyImport from "./legacy-import.json";

type ImportedSection = { id:string; warehouseId:string; warehouseSlug:string; slug:string; nameAr:string; nameEn:string; sortOrder:number; images:string[] };

const importedCatalogs: Catalog[] = (legacyImport as ImportedSection[]).map((section,index)=>({
  id:`imported-${section.id}`,
  slug:`${section.warehouseSlug}-${section.slug}`,
  nameAr:section.nameAr,
  nameEn:section.nameEn,
  modelCode:`${section.warehouseSlug}-${section.slug}`.toUpperCase(),
  category:"travel",
  coverUrl:section.images[0] ?? "/catalogs/consul-luggage-2026/page-01.jpeg",
  images:section.images.map((url,sortOrder)=>({id:`${section.id}-${sortOrder}`,url,width:1600,height:900,sortOrder,alt:`${section.nameEn} ${sortOrder+1}`})),
  productCount:section.images.length,
  updatedAt:"2026-08-01",
  featured:false,
  isNew:false,
  bestSeller:false,
  sortOrder:1000+index,
  warehouseIds:[section.warehouseId],
  colors:[],
  inventory:[],
}));

const memoryWarehouses: Warehouse[] = warehousesSeed as Warehouse[];
let memoryCatalogs: Catalog[] = [...(JSON.parse(JSON.stringify(seed)) as Catalog[]).filter((catalog)=>catalog.id==="cat-007").map((catalog) => ({ ...catalog, modelCode:catalog.slug.toUpperCase(), colors: catalog.colors ?? [], inventory:(catalog.colors ?? []).map(color=>({color,sku:"",barcode:"",quantities:{}})), warehouseIds: memoryWarehouses.map((warehouse) => warehouse.id) })), ...importedCatalogs];
const memoryCategories: Category[] = categoriesSeed as Category[];
let memorySiteSettings: SiteSettings = {
  heroDescriptionAr: "", heroDescriptionEn: "", newDescriptionAr: "", newDescriptionEn: "",
  bestDescriptionAr: "", bestDescriptionEn: "", libraryDescriptionAr: "", libraryDescriptionEn: "",
  phone: "", whatsapp: "", email: "", instagram: "", facebook: "", tiktok: "", linkedin: "",
};

type CatalogRow = {
  id: string; slug: string; name_ar: string; name_en: string; category_id: string | null;
  cover_url: string | null; pdf_url: string | null; product_count: number | null;
  updated_at: string; featured: boolean | null; is_new: boolean | null;
  best_seller: boolean | null; sort_order: number | null;
  colors: string[] | null;
};
type ImageRow = {
  id: string; catalog_id: string; url: string; width: number | null; height: number | null;
  alt: string | null; sort_order: number | null;
};

function mapImage(row: ImageRow): CatalogImage {
  return { id: row.id, url: row.url, width: row.width ?? 1600, height: row.height ?? 2000,
    alt: row.alt ?? undefined, sortOrder: row.sort_order ?? 0 };
}

function parseCatalogMeta(values: string[]): {modelCode:string;inventory:CatalogInventoryItem[]} {
  const metadata=values.find((value)=>value.startsWith("@catalog::"));
  let modelCode="";
  if(metadata){try{modelCode=String(JSON.parse(metadata.slice(10)).modelCode??"")}catch{}}
  const inventory=values.filter((value)=>!value.startsWith("@catalog::")).map((value) => {
    if(value.startsWith("@variant::")){try{const item=JSON.parse(value.slice(10));return {color:String(item.color??""),sku:String(item.sku??""),barcode:String(item.barcode??""),quantities:item.quantities??{}}}catch{}}
    const [color, encoded = ""] = value.split("::", 2);
    const quantities = Object.fromEntries(encoded.split("|").filter(Boolean).map((entry) => {
      const separator = entry.lastIndexOf("=");
      return [entry.slice(0, separator), Math.max(0, Number(entry.slice(separator + 1)) || 0)];
    }));
    return { color: color.trim(), sku:"", barcode:"", quantities };
  }).filter((item):item is CatalogInventoryItem=>Boolean(item?.color));
  return {modelCode,inventory};
}

function serializeInventory(catalog: Catalog): string[] {
  const inventory = catalog.inventory?.length ? catalog.inventory : catalog.colors.map((color) => ({ color, sku:"", barcode:"", quantities: {} }));
  return [`@catalog::${JSON.stringify({modelCode:catalog.modelCode})}`,...inventory.map((item) => `@variant::${JSON.stringify({...item,quantities:Object.fromEntries(Object.entries(item.quantities).map(([id,quantity])=>[id,Math.max(0,Number(quantity)||0)]))})}`)];
}

async function getSupabaseCatalogs(): Promise<Catalog[] | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  const [catalogResult, categoryResult, imageResult, warehouseResult] = await Promise.all([
    supabase.from("catalogs").select("*").order("sort_order"),
    supabase.from("categories").select("id, slug"),
    supabase.from("catalog_images").select("*").order("sort_order"),
    supabase.from("catalog_warehouses").select("catalog_id, warehouse_id"),
  ]);
  if (catalogResult.error) throw catalogResult.error;
  if (categoryResult.error) throw categoryResult.error;
  if (imageResult.error) throw imageResult.error;
  if (warehouseResult.error) throw warehouseResult.error;

  const categoryById = new Map((categoryResult.data ?? []).map((c) => [c.id, c.slug]));
  const imagesByCatalog = new Map<string, CatalogImage[]>();
  const warehousesByCatalog = new Map<string, string[]>();
  for (const link of warehouseResult.data ?? []) {
    const ids = warehousesByCatalog.get(link.catalog_id) ?? [];
    ids.push(link.warehouse_id); warehousesByCatalog.set(link.catalog_id, ids);
  }
  for (const row of (imageResult.data ?? []) as ImageRow[]) {
    const images = imagesByCatalog.get(row.catalog_id) ?? [];
    images.push(mapImage(row));
    imagesByCatalog.set(row.catalog_id, images);
  }
  return ((catalogResult.data ?? []) as CatalogRow[]).map((row) => {
    const metadata = parseCatalogMeta(row.colors ?? []);
    const inventory = metadata.inventory;
    return ({
    id: row.id, slug: row.slug, nameAr: row.name_ar, nameEn: row.name_en, modelCode:metadata.modelCode||row.slug.toUpperCase(),
    category: row.category_id ? categoryById.get(row.category_id) ?? "" : "",
    coverUrl: row.cover_url ?? "https://picsum.photos/seed/consul-default/1200/1500",
    pdfUrl: row.pdf_url ?? undefined, productCount: row.product_count ?? 0,
    updatedAt: row.updated_at, featured: row.featured ?? false, isNew: row.is_new ?? false,
    bestSeller: row.best_seller ?? false, sortOrder: row.sort_order ?? 0,
    images: imagesByCatalog.get(row.id) ?? [], warehouseIds: warehousesByCatalog.get(row.id) ?? [], colors: inventory.map((item) => item.color), inventory,
  });
  });
}

export async function getCatalogs(): Promise<Catalog[]> {
  const remote = await getSupabaseCatalogs();
  if (!remote) return [...memoryCatalogs].sort((a, b) => a.sortOrder - b.sortOrder);
  const remoteIds = new Set(remote.map(c=>c.id));
  const remoteSlugs = new Set(remote.map(c=>c.slug));
  return [...remote,...importedCatalogs.filter(c=>!remoteIds.has(c.id)&&!remoteSlugs.has(c.slug))].sort((a,b)=>a.sortOrder-b.sortOrder);
}
export async function getFeaturedCatalogs() { return (await getCatalogs()).filter((c) => c.featured); }
export async function getNewArrivals() { return (await getCatalogs()).filter((c) => c.isNew); }
export async function getBestSellers() { return (await getCatalogs()).filter((c) => c.bestSeller); }
export async function getCatalogBySlug(slug: string) { return (await getCatalogs()).find((c) => c.slug === slug); }
export async function getCatalogById(id: string) { return (await getCatalogs()).find((c) => c.id === id); }

export async function getCategories(): Promise<Category[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return memoryCategories;
  const { data, error } = await supabase.from("categories").select("id, slug, name_ar, name_en").order("name_en");
  if (error) throw error;
  return (data ?? []).map((row) => ({ id: row.id, slug: row.slug, nameAr: row.name_ar, nameEn: row.name_en }));
}

export async function getWarehouses(): Promise<Warehouse[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [...memoryWarehouses].sort((a,b)=>a.sortOrder-b.sortOrder);
  const { data, error } = await supabase.from("warehouses").select("*").eq("active", true).order("sort_order");
  if (error) throw error;
  return (data ?? []).map(row=>({ id:row.id, slug:row.slug, nameAr:row.name_ar, nameEn:row.name_en, cityAr:row.city_ar, cityEn:row.city_en, descriptionAr:row.description_ar??undefined, descriptionEn:row.description_en??undefined, sortOrder:row.sort_order??0, active:row.active??true }));
}

export async function getWarehouseBySlug(slug:string){return (await getWarehouses()).find(w=>w.slug===slug)}
export async function getCatalogsByWarehouse(warehouseId:string){return (await getCatalogs()).filter(c=>c.warehouseIds.includes(warehouseId))}

export async function createWarehouse(input:Omit<Warehouse,"id">):Promise<Warehouse>{const supabase=getSupabaseClient();if(!supabase){const warehouse={...input,id:`warehouse-${Date.now()}`};memoryWarehouses.push(warehouse);return warehouse;}const {data,error}=await supabase.from("warehouses").insert({slug:input.slug,name_ar:input.nameAr,name_en:input.nameEn,city_ar:input.cityAr,city_en:input.cityEn,description_ar:input.descriptionAr??null,description_en:input.descriptionEn??null,sort_order:input.sortOrder,active:input.active}).select("id").single();if(error)throw error;return {...input,id:data.id}}
export async function deleteWarehouse(id:string){const supabase=getSupabaseClient();if(!supabase){const index=memoryWarehouses.findIndex(w=>w.id===id);if(index>=0)memoryWarehouses.splice(index,1);memoryCatalogs=memoryCatalogs.map(c=>({...c,warehouseIds:c.warehouseIds.filter(w=>w!==id)}));return;}const {error}=await supabase.from("warehouses").delete().eq("id",id);if(error)throw error}

export async function createCategory(category: Omit<Category, "id">): Promise<Category> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    const created = { ...category, id: `category-${Date.now()}` };
    memoryCategories.push(created);
    return created;
  }
  const { data, error } = await supabase.from("categories").insert({ slug: category.slug, name_ar: category.nameAr, name_en: category.nameEn }).select("id, slug, name_ar, name_en").single();
  if (error) throw error;
  return { id: data.id, slug: data.slug, nameAr: data.name_ar, nameEn: data.name_en };
}

export async function deleteCategory(id: string): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    const index = memoryCategories.findIndex((category) => category.id === id);
    if (index >= 0) memoryCategories.splice(index, 1);
    return;
  }
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw error;
}

async function categoryIdForSlug(slug: string): Promise<string | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  const { data, error } = await supabase.from("categories").select("id").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return data?.id ?? null;
}

function catalogRow(catalog: Catalog, categoryId: string | null) {
  return { slug: catalog.slug, name_ar: catalog.nameAr, name_en: catalog.nameEn,
    category_id: categoryId, cover_url: catalog.coverUrl, pdf_url: catalog.pdfUrl ?? null,
    product_count: catalog.productCount, featured: catalog.featured, is_new: catalog.isNew,
    best_seller: catalog.bestSeller, sort_order: catalog.sortOrder, updated_at: catalog.updatedAt, colors: serializeInventory(catalog) };
}

export async function createCatalog(catalog: Catalog): Promise<Catalog> {
  const supabase = getSupabaseClient();
  if (!supabase) { memoryCatalogs.push(catalog); return catalog; }
  const categoryId = await categoryIdForSlug(catalog.category);
  const { data, error } = await supabase.from("catalogs").insert(catalogRow(catalog, categoryId)).select("id").single();
  if (error) throw error;
  if (catalog.images.length) {
    const { error: imagesError } = await supabase.from("catalog_images").insert(catalog.images.map((image) => ({
      catalog_id: data.id, url: image.url, width: image.width, height: image.height,
      alt: image.alt ?? null, sort_order: image.sortOrder,
    })));
    if (imagesError) throw imagesError;
  }
  if (catalog.warehouseIds.length) { const {error:warehouseError}=await supabase.from("catalog_warehouses").insert(catalog.warehouseIds.map(warehouse_id=>({catalog_id:data.id,warehouse_id}))); if(warehouseError)throw warehouseError; }
  return { ...catalog, id: data.id };
}

export async function updateCatalog(id: string, patch: Partial<Catalog>): Promise<Catalog | undefined> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    const idx = memoryCatalogs.findIndex((c) => c.id === id);
    if (idx === -1) return undefined;
    memoryCatalogs[idx] = { ...memoryCatalogs[idx], ...patch };
    return memoryCatalogs[idx];
  }
  const current = await getCatalogById(id);
  if (!current) return undefined;
  const updated = { ...current, ...patch };
  if (id.startsWith("imported-")) return createCatalog(updated);
  const categoryId = await categoryIdForSlug(updated.category);
  const { error } = await supabase.from("catalogs").update(catalogRow(updated, categoryId)).eq("id", id);
  if (error) throw error;
  const imagesChanged=patch.images&&patch.images.map((image)=>image.url.trim()).join("\n")!==current.images.map((image)=>image.url.trim()).join("\n");
  if (patch.images&&imagesChanged) {
    const { error: deleteError } = await supabase.from("catalog_images").delete().eq("catalog_id", id);
    if (deleteError) throw deleteError;
    if (patch.images.length) {
      const { error: insertError } = await supabase.from("catalog_images").insert(patch.images.map((image) => ({
        catalog_id: id, url: image.url, width: image.width, height: image.height,
        alt: image.alt ?? null, sort_order: image.sortOrder,
      })));
      if (insertError) throw insertError;
    }
  }
  if (patch.warehouseIds) { const {error:deleteWarehouseError}=await supabase.from("catalog_warehouses").delete().eq("catalog_id",id);if(deleteWarehouseError)throw deleteWarehouseError;if(patch.warehouseIds.length){const {error:insertWarehouseError}=await supabase.from("catalog_warehouses").insert(patch.warehouseIds.map(warehouse_id=>({catalog_id:id,warehouse_id})));if(insertWarehouseError)throw insertWarehouseError;} }
  return updated;
}

export async function deleteCatalog(id: string): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) { memoryCatalogs = memoryCatalogs.filter((c) => c.id !== id); return; }
  const { error } = await supabase.from("catalogs").delete().eq("id", id);
  if (error) throw error;
}

export async function reorderCatalogs(orderedIds: string[]): Promise<void> {
  await Promise.all(orderedIds.map((id, sortOrder) => updateCatalog(id, { sortOrder })));
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = getSupabaseClient();
  if (!supabase) return memorySiteSettings;
  const { data, error } = await supabase.from("site_settings").select("value").eq("key", "public_site").maybeSingle();
  if (error) throw error;
  return { ...memorySiteSettings, ...((data?.value as Partial<SiteSettings> | null) ?? {}) };
}

export async function updateSiteSettings(settings: SiteSettings): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) { memorySiteSettings = settings; return; }
  const { error } = await supabase.from("site_settings").upsert({ key: "public_site", value: settings, updated_at: new Date().toISOString() });
  if (error) throw error;
}
