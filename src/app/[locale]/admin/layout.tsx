import AdminShell from "@/components/admin/AdminShell";
import type { Locale } from "@/i18n/config";
import { getAdminAccess } from "@/lib/auth";
export default async function AdminLayout({children,params}:{children:React.ReactNode;params:Promise<{locale:string}>}){const {locale}=await params;const access=await getAdminAccess();return <AdminShell locale={locale as Locale} access={access}>{children}</AdminShell>}
