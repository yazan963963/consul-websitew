"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { grantAdmin, revokeAdmin, checkPassword, requireAdmin, requireEditor, requireSuperAdmin, signInAdmin } from "./auth";
import { getSupabaseClient } from "./supabase/client";
import { createCatalog, createCategory, createWarehouse, deleteCatalog, deleteCategory, deleteWarehouse, getCatalogBySlug, getCatalogs, getWarehouses, reorderCatalogs, updateCatalog, updateSiteSettings } from "./data";
import type { Catalog, CatalogImage, SiteSettings } from "./types";
import { selectedFiles, uploadFile } from "./uploads";

export async function loginAction(locale: string, formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const email = String(formData.get("email") ?? "").trim();
  const signedIn = email ? await signInAdmin(email, password) : false;
  if (!signedIn && !checkPassword(password)) {
    redirect(`/${locale}/admin/login?error=1`);
  }
  if (!signedIn) await grantAdmin();
  redirect(`/${locale}/admin`);
}

export async function logoutAction(locale: string) {
  await revokeAdmin();
  redirect(`/${locale}/admin/login`);
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u0600-\u06FF\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function imagesFromForm(formData: FormData): Promise<CatalogImage[]> {
  const files = selectedFiles(formData, "catalogImages");
  const urls = files.length
    ? await Promise.all(files.map((file) => uploadFile(file, "image")))
    : String(formData.get("existingImageUrls") ?? "").split("\n").filter(Boolean);
  return urls.map((url, sortOrder) => ({
      id: `img-${Date.now()}-${sortOrder}`,
      url,
      width: 1600,
      height: 2000,
      sortOrder,
    }));
}

async function catalogFields(formData: FormData) {
  const nameAr = String(formData.get("nameAr") ?? "").trim();
  const nameEn = String(formData.get("nameEn") ?? "").trim();
  const rawSlug = String(formData.get("slug") ?? "").trim();
  const coverFile = selectedFiles(formData, "coverFile")[0];
  const pdfFile = selectedFiles(formData, "pdfFile")[0];
  return {
    slug: slugify(rawSlug || nameEn || nameAr),
    nameAr,
    nameEn,
    category: String(formData.get("category") ?? ""),
    coverUrl: coverFile
      ? await uploadFile(coverFile, "cover")
      : String(formData.get("existingCoverUrl") ?? "").trim(),
    pdfUrl: pdfFile
      ? await uploadFile(pdfFile, "pdf")
      : String(formData.get("existingPdfUrl") ?? "").trim() || undefined,
    productCount: Math.max(0, Number(formData.get("productCount") ?? 0) || 0),
    images: await imagesFromForm(formData),
    featured: formData.get("featured") === "on",
    isNew: formData.get("isNew") === "on",
    bestSeller: formData.get("bestSeller") === "on",
    warehouseIds: formData.getAll("warehouseIds").map(String).filter(Boolean),
    colors: String(formData.get("colors") ?? "").split(/[،,\n]/).map((color) => color.trim()).filter((color, index, colors) => color && colors.indexOf(color) === index),
  };
}

function revalidateCatalogPaths(locale: string, slug?: string) {
  revalidatePath(`/${locale}`);
  revalidatePath(`/${locale}/catalogs`);
  revalidatePath(`/${locale}/warehouses`);
  revalidatePath(`/${locale}/admin`);
  if (slug) revalidatePath(`/${locale}/catalog/${slug}`);
  revalidatePath("/sitemap.xml");
}

export async function createCatalogAction(locale: string, formData: FormData) {
  await requireEditor(locale);
  const fields = await catalogFields(formData);
  if (!fields.slug || !fields.nameAr || !fields.nameEn || !fields.category || !fields.warehouseIds.length) {
    redirect(`/${locale}/admin/catalogs/new?error=required`);
  }
  if (await getCatalogBySlug(fields.slug)) {
    redirect(`/${locale}/admin/catalogs/new?error=slug`);
  }
  const catalogs = await getCatalogs();

  const catalog: Catalog = {
    id: `cat-${Date.now()}`,
    ...fields,
    coverUrl: fields.coverUrl || `https://picsum.photos/seed/${fields.slug}/1200/1500`,
    updatedAt: new Date().toISOString().slice(0, 10),
    sortOrder: catalogs.length,
  };

  await createCatalog(catalog);
  revalidateCatalogPaths(locale, catalog.slug);
  redirect(`/${locale}/admin`);
}

export async function updateCatalogAction(locale: string, id: string, formData: FormData) {
  await requireEditor(locale);
  const fields = await catalogFields(formData);
  if (!fields.slug || !fields.nameAr || !fields.nameEn || !fields.category || !fields.warehouseIds.length) {
    redirect(`/${locale}/admin/catalogs/${id}/edit?error=required`);
  }
  const duplicate = await getCatalogBySlug(fields.slug);
  if (duplicate && duplicate.id !== id) {
    redirect(`/${locale}/admin/catalogs/${id}/edit?error=slug`);
  }
  const updated = await updateCatalog(id, {
    ...fields,
    coverUrl: fields.coverUrl || `https://picsum.photos/seed/${fields.slug}/1200/1500`,
    updatedAt: new Date().toISOString().slice(0, 10),
  });
  if (!updated) redirect(`/${locale}/admin`);
  revalidateCatalogPaths(locale, fields.slug);
  redirect(`/${locale}/admin`);
}

export async function deleteCatalogAction(locale: string, id: string) {
  await requireEditor(locale);
  await deleteCatalog(id);
  revalidateCatalogPaths(locale);
}

export async function toggleFlagAction(
  locale: string,
  id: string,
  flag: "featured" | "isNew" | "bestSeller",
  value: boolean
) {
  await requireEditor(locale);
  await updateCatalog(id, { [flag]: value });
  revalidateCatalogPaths(locale);
}

export async function createCategoryAction(locale: string, formData: FormData) {
  await requireEditor(locale);
  const nameAr = String(formData.get("nameAr") ?? "").trim();
  const nameEn = String(formData.get("nameEn") ?? "").trim();
  const slug = slugify(String(formData.get("slug") ?? "") || nameEn || nameAr);
  if (nameAr && nameEn && slug) await createCategory({ nameAr, nameEn, slug });
  revalidatePath(`/${locale}/admin/categories`);
  revalidatePath(`/${locale}/catalogs`);
}

export async function deleteCategoryAction(locale: string, id: string) {
  await requireEditor(locale);
  await deleteCategory(id);
  revalidatePath(`/${locale}/admin/categories`);
  revalidatePath(`/${locale}/catalogs`);
}

export async function createWarehouseAction(locale:string,formData:FormData){await requireEditor(locale);const nameAr=String(formData.get("nameAr")??"").trim();const nameEn=String(formData.get("nameEn")??"").trim();const cityAr=String(formData.get("cityAr")??"").trim();const cityEn=String(formData.get("cityEn")??"").trim();const slug=slugify(String(formData.get("slug")??"")||nameEn||nameAr);if(nameAr&&nameEn&&cityAr&&cityEn&&slug){const warehouses=await getWarehouses();await createWarehouse({nameAr,nameEn,cityAr,cityEn,slug,descriptionAr:String(formData.get("descriptionAr")??"").trim(),descriptionEn:String(formData.get("descriptionEn")??"").trim(),sortOrder:warehouses.length,active:true})}revalidatePath(`/${locale}/admin/warehouses`);revalidatePath(`/${locale}/warehouses`)}
export async function deleteWarehouseAction(locale:string,id:string){await requireEditor(locale);await deleteWarehouse(id);revalidatePath(`/${locale}/admin/warehouses`);revalidatePath(`/${locale}/warehouses`)}

export async function reorderCatalogsAction(locale: string, ids: string[]) {
  await requireEditor(locale);
  await reorderCatalogs(ids);
  revalidateCatalogPaths(locale);
}

export async function createUserAction(locale: string, formData: FormData) {
  await requireSuperAdmin(locale);
  const supabase = getSupabaseClient();
  if (!supabase) return;
  const email=String(formData.get("email")??"").trim(); const password=String(formData.get("password")??""); const role=String(formData.get("role")??"viewer");
  if(!email||password.length<8)return;
  const {data,error}=await supabase.auth.admin.createUser({email,password,email_confirm:true});
  if(error)throw error;
  await supabase.from("profiles").upsert({id:data.user.id,email,role,active:true});
  revalidatePath(`/${locale}/admin/users`);
}

export async function toggleUserAction(locale:string,id:string,active:boolean){await requireSuperAdmin(locale);const supabase=getSupabaseClient();if(!supabase)return;const {error}=await supabase.from("profiles").update({active}).eq("id",id);if(error)throw error;revalidatePath(`/${locale}/admin/users`)}

export async function updateSiteSettingsAction(locale: string, formData: FormData) {
  await requireEditor(locale);
  const fields: (keyof SiteSettings)[] = ["heroDescriptionAr","heroDescriptionEn","newDescriptionAr","newDescriptionEn","bestDescriptionAr","bestDescriptionEn","libraryDescriptionAr","libraryDescriptionEn","phone","whatsapp","email","instagram","facebook","tiktok","linkedin"];
  const settings = Object.fromEntries(fields.map((field) => [field, String(formData.get(field) ?? "").trim()])) as unknown as SiteSettings;
  await updateSiteSettings(settings);
  revalidatePath(`/${locale}`, "layout");
  revalidatePath(`/${locale}/catalogs`);
  revalidatePath(`/${locale}/admin/settings`);
  const intent = String(formData.get("intent") ?? "save");
  redirect(intent === "preview" ? `/${locale}` : `/${locale}/admin/settings?saved=1`);
}
