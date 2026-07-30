import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { getCatalogs, getNewArrivals, getBestSellers, getCategories } from "@/lib/data";
import Hero from "@/components/Hero";
import NewArrivals from "@/components/NewArrivals";
import BestSellers from "@/components/BestSellers";
import CatalogGrid from "@/components/CatalogGrid";

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const [catalogs, newArrivals, bestSellers, categories] = await Promise.all([
    getCatalogs(),
    getNewArrivals(),
    getBestSellers(),
    getCategories(),
  ]);

  return (
    <>
      <Hero dict={dict} />
      <NewArrivals catalogs={newArrivals} locale={locale} dict={dict} />
      <BestSellers catalogs={bestSellers} locale={locale} dict={dict} />
      <CatalogGrid catalogs={catalogs} categories={categories} locale={locale} dict={dict} />
    </>
  );
}
