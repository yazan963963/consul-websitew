import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { localeMeta } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { getCatalogBySlug, getCatalogs } from "@/lib/data";
import CatalogViewer from "@/components/CatalogViewer";
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
  const [dict, catalog] = await Promise.all([getDictionary(locale), getCatalogBySlug(slug)]);

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
          <p className="mt-2 text-sm text-(--color-bone)">
            {catalog.productCount} {dict.catalog.products} · {dict.catalog.updated}{" "}
            {formatDate(catalog.updatedAt, locale)}
          </p>
        </div>
        <ShareMenu url={shareUrl} title={name} pdfUrl={catalog.pdfUrl} dict={dict} />
      </div>

      {catalog.colors.length > 0 && <section className="mb-7 rounded-2xl border border-(--color-line) bg-(--color-surface)/60 p-5"><p className="mb-3 text-xs uppercase tracking-[.18em] text-(--color-gold)">{locale === "ar" ? "الألوان المتوفرة" : "Available colors"}</p><div className="flex flex-wrap gap-2">{catalog.colors.map(color=><span key={color} className="rounded-full border border-(--color-gold)/20 bg-(--color-gold)/8 px-3 py-1.5 text-xs text-(--color-bone)">{color}</span>)}</div></section>}

      <CatalogViewer images={catalog.images} dict={dict} dir={localeMeta[locale].dir} />
    </div>
  );
}
