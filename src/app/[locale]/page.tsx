import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { getCatalogs, getSiteSettings, getWarehouses } from "@/lib/data";
import Hero from "@/components/Hero";
import WarehouseShowcase from "@/components/WarehouseShowcase";

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const [catalogs, settings, warehouses] = await Promise.all([
    getCatalogs(),
    getSiteSettings(),
    getWarehouses(),
  ]);

  return (
    <>
      <Hero dict={dict} locale={locale} catalogs={catalogs} totalProducts={catalogs.reduce((sum, catalog) => sum + catalog.productCount, 0)} description={locale === "ar" ? settings.heroDescriptionAr : settings.heroDescriptionEn} />
      <WarehouseShowcase warehouses={warehouses} catalogs={catalogs} locale={locale} />
    </>
  );
}
