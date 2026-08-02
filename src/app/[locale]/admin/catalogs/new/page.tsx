import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { requirePermission } from "@/lib/auth";
import { getCategories, getWarehouses } from "@/lib/data";
import { createCatalogAction } from "@/lib/actions";
import CatalogForm from "@/components/CatalogForm";

export default async function NewCatalogPage({ params, searchParams }: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { locale } = await params;
  const { error } = await searchParams;
  await requirePermission(locale,"catalogs.create");
  const [dict, categories, warehouses] = await Promise.all([getDictionary(locale), getCategories(), getWarehouses()]);
  return <div className="mx-auto max-w-2xl px-5 py-12 md:px-8"><h1 className="mb-8 font-(family-name:--font-display) text-2xl text-(--color-ivory)">{dict.admin.addNew}</h1><CatalogForm action={createCatalogAction.bind(null, locale)} categories={categories} warehouses={warehouses} locale={locale} dict={dict} error={error} /></div>;
}
