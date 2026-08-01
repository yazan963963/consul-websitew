import { notFound } from "next/navigation";
import CatalogForm from "@/components/CatalogForm";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { updateCatalogAction } from "@/lib/actions";
import { requireAdmin } from "@/lib/auth";
import { getCatalogById, getCategories, getWarehouses } from "@/lib/data";

export default async function EditCatalogPage({ params, searchParams }: {
  params: Promise<{ locale: Locale; id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { locale, id } = await params;
  const { error } = await searchParams;
  await requireAdmin(locale);
  const [dict, categories, catalog, warehouses] = await Promise.all([getDictionary(locale), getCategories(), getCatalogById(id), getWarehouses()]);
  if (!catalog) notFound();
  return <div className="mx-auto max-w-2xl px-5 py-12 md:px-8"><h1 className="mb-8 font-(family-name:--font-display) text-2xl text-(--color-ivory)">{dict.admin.edit}: {locale === "ar" ? catalog.nameAr : catalog.nameEn}</h1><CatalogForm action={updateCatalogAction.bind(null, locale, id)} catalog={catalog} categories={categories} warehouses={warehouses} locale={locale} dict={dict} error={error} /></div>;
}
