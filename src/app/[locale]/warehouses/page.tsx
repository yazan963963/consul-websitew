import type { Locale } from "@/i18n/config";
import { getCatalogs, getWarehouses } from "@/lib/data";
import WarehouseShowcase from "@/components/WarehouseShowcase";
export default async function WarehousesPage({params}:{params:Promise<{locale:Locale}>}){const {locale}=await params;const [warehouses,catalogs]=await Promise.all([getWarehouses(),getCatalogs()]);return <WarehouseShowcase warehouses={warehouses} catalogs={catalogs} locale={locale} compact/>}
