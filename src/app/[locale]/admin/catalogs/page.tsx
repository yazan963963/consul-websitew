import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { requirePermission } from "@/lib/auth";
import { getCatalogs, getCategories, getWarehouses } from "@/lib/data";
import AdminCatalogList from "@/components/admin/AdminCatalogList";
import { buttonVariants } from "@/components/ui/button";

export default async function CatalogsAdminPage({params}:{params:Promise<{locale:Locale}>}) {
  const {locale}=await params;
  const access=await requirePermission(locale,"catalogs.view");
  const [catalogs,categories,warehouses]=await Promise.all([getCatalogs(),getCategories(),getWarehouses()]);
  const ar=locale==="ar";
  const siteUrl=process.env.NEXT_PUBLIC_SITE_URL??"http://localhost:3000";
  return <div className="mx-auto max-w-7xl">
    <div className="mb-6 flex items-center justify-between">
      <div><h1 className="text-2xl font-semibold">{ar?"إدارة الكتالوجات":"Catalog management"}</h1><p className="mt-1 text-sm text-(--color-smoke)">{ar?"ابحث، صفِّ حسب المستودع، ورتّب بالسحب":"Search, filter by warehouse, and drag to reorder"}</p></div>
      {access.permissions.includes("catalogs.create")&&<Link href={`/${locale}/admin/catalogs/new`} className={buttonVariants()}>{ar?"إضافة كتالوج":"Add catalog"}</Link>}
    </div>
    <AdminCatalogList initialCatalogs={catalogs} categories={categories} warehouses={warehouses} locale={locale} siteUrl={siteUrl} permissions={access.permissions}/>
  </div>;
}
