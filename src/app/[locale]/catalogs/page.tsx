import CatalogGrid from "@/components/CatalogGrid";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { getCatalogs, getCategories, getSiteSettings } from "@/lib/data";

export default async function CatalogsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const [dict, catalogs, categories, settings] = await Promise.all([
    getDictionary(locale),
    getCatalogs(),
    getCategories(),
    getSiteSettings(),
  ]);

  return <CatalogGrid catalogs={catalogs} categories={categories} locale={locale} dict={dict} description={locale === "ar" ? settings.libraryDescriptionAr : settings.libraryDescriptionEn} />;
}
