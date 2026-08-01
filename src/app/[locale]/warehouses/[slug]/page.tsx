import { notFound } from "next/navigation";
import { Building2, MapPin } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { getCatalogsByWarehouse, getCategories, getWarehouseBySlug } from "@/lib/data";
import { getDictionary } from "@/i18n/getDictionary";
import CatalogGrid from "@/components/CatalogGrid";

export default async function WarehousePage({params}:{params:Promise<{locale:Locale;slug:string}>}) {
  const {locale,slug}=await params;
  const warehouse=await getWarehouseBySlug(slug);
  if(!warehouse) notFound();
  const [catalogs,categories,dict]=await Promise.all([getCatalogsByWarehouse(warehouse.id),getCategories(),getDictionary(locale)]);
  const ar=locale==="ar";
  return <>
    <section className="relative overflow-hidden border-b border-(--color-line) bg-[radial-gradient(circle_at_80%_20%,rgba(201,162,39,.12),transparent_38%)] px-5 py-20 md:px-8">
      <div className="hero-grid absolute inset-0 opacity-20"/>
      <div className="relative mx-auto max-w-7xl">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-(--color-gold)/20 bg-(--color-gold)/8 px-3 py-1.5 text-xs text-(--color-gold)"><Building2 size={14}/>{ar?"مستودع CONSUL":"CONSUL Warehouse"}</div>
        <h1 className="font-(family-name:--font-display) text-5xl md:text-7xl">{ar?warehouse.nameAr:warehouse.nameEn}</h1>
        <p className="mt-5 flex items-center gap-2 text-sm text-(--color-bone)"><MapPin size={15} className="text-(--color-gold)"/>{ar?warehouse.cityAr:warehouse.cityEn} · {catalogs.length} {ar?"نوع حقيبة":"bag types"}</p>
      </div>
    </section>
    <CatalogGrid catalogs={catalogs} categories={categories} locale={locale} dict={dict} title={ar?"أنواع الحقائب":"Bag types"} hideCategories/>
  </>;
}
