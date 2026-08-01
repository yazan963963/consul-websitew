import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { localeMeta } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { getCatalogBySlug, getCatalogs, getWarehouses } from "@/lib/data";
import CatalogViewer from "@/components/CatalogViewer";
import InventoryDisplay from "@/components/InventoryDisplay";
import ShareMenu from "@/components/ShareMenu";
import { formatDate } from "@/lib/utils";

export async function generateStaticParams() {
  const catalogs = await getCatalogs();
  return catalogs.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const catalog = await getCatalogBySlug(slug);
  if (!catalog) return {};
  const name = locale === "ar" ? catalog.nameAr : catalog.nameEn;
  return {
    title: name,
    description: `${name} — CONSUL`,
    openGraph: { images: [catalog.coverUrl] },
  };
}

export default async function CatalogPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const [dict, catalog, warehouses] = await Promise.all([getDictionary(locale), getCatalogBySlug(slug), getWarehouses()]);

  if (!catalog) notFound();

  const name = locale === "ar" ? catalog.nameAr : catalog.nameEn;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const shareUrl = `${siteUrl}/${locale}/catalog/${catalog.slug}`;

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 md:px-8">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-(--color-gold)">{catalog.category}</p>
          <h1 className="mt-1 font-(family-name:--font-display) text-3xl text-(--color-ivory)">{name}</h1>
          <p className="mt-2 text-xs uppercase tracking-[.16em] text-(--color-gold)">{catalog.modelCode}</p>
          <p className="mt-2 text-sm text-(--color-bone)">
            {catalog.productCount} {dict.catalog.products} · {dict.catalog.updated}{" "}
            {formatDate(catalog.updatedAt, locale)}
          </p>
        </div>
        <ShareMenu url={shareUrl} title={name} pdfUrl={catalog.pdfUrl} dict={dict} />
      </div>

      <CatalogViewer images={catalog.images} dict={dict} dir={localeMeta[locale].dir} />
      <div className="mt-6"><InventoryDisplay inventory={catalog.inventory} warehouses={warehouses.filter((warehouse)=>catalog.warehouseIds.includes(warehouse.id))} locale={locale}/></div>
    </div>
  );
}
