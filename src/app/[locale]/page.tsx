import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { getCatalogs, getNewArrivals, getBestSellers, getCategories, getSiteSettings, getWarehouses } from "@/lib/data";
import Hero from "@/components/Hero";
import NewArrivals from "@/components/NewArrivals";
import BestSellers from "@/components/BestSellers";
import CatalogGrid from "@/components/CatalogGrid";
import WarehouseShowcase from "@/components/WarehouseShowcase";

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const [catalogs, newArrivals, bestSellers, categories, settings, warehouses] = await Promise.all([
    getCatalogs(),
    getNewArrivals(),
    getBestSellers(),
    getCategories(),
    getSiteSettings(),
    getWarehouses(),
  ]);

  return (
    <>
      <Hero dict={dict} locale={locale} catalogs={catalogs} totalProducts={catalogs.reduce((sum, catalog) => sum + catalog.productCount, 0)} description={locale === "ar" ? settings.heroDescriptionAr : settings.heroDescriptionEn} />
      <WarehouseShowcase warehouses={warehouses} catalogs={catalogs} locale={locale} />
      <NewArrivals catalogs={newArrivals} locale={locale} dict={dict} description={locale === "ar" ? settings.newDescriptionAr : settings.newDescriptionEn} />
      <BestSellers catalogs={bestSellers} locale={locale} dict={dict} description={locale === "ar" ? settings.bestDescriptionAr : settings.bestDescriptionEn} />
      <CatalogGrid catalogs={catalogs} categories={categories} locale={locale} dict={dict} description={locale === "ar" ? settings.libraryDescriptionAr : settings.libraryDescriptionEn} />
    </>
  );
}
