import { UserPlus, Users } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { createUserAction, toggleUserAction, updateUserPermissionsAction } from "@/lib/actions";
import { requirePermission } from "@/lib/auth";
import { PERMISSIONS, ROLE_PERMISSIONS, type Permission } from "@/lib/permissions";
import { getSupabaseClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const groups:{titleAr:string;titleEn:string;items:Permission[]}[]=[
  {titleAr:"الرئيسية",titleEn:"Dashboard",items:["dashboard.view"]},
  {titleAr:"الكتالوجات",titleEn:"Catalogs",items:["catalogs.view","catalogs.create","catalogs.edit","catalogs.delete","catalogs.inventory"]},
  {titleAr:"المستودعات",titleEn:"Warehouses",items:["warehouses.view","warehouses.manage"]},
  {titleAr:"التصنيفات",titleEn:"Categories",items:["categories.view","categories.manage"]},
  {titleAr:"الإعدادات",titleEn:"Settings",items:["settings.view","settings.manage"]},
  {titleAr:"المستخدمون",titleEn:"Users",items:["users.view","users.manage"]},
];
const labels:Record<Permission,[string,string]>={
  "dashboard.view":["عرض الصفحة","View page"],"catalogs.view":["عرض","View"],"catalogs.create":["إضافة","Create"],"catalogs.edit":["تعديل وترتيب","Edit & sort"],"catalogs.delete":["حذف","Delete"],"catalogs.inventory":["الكميات والألوان","Inventory & colors"],"warehouses.view":["عرض","View"],"warehouses.manage":["إضافة وحذف","Manage"],"categories.view":["عرض","View"],"categories.manage":["إضافة وحذف","Manage"],"settings.view":["عرض","View"],"settings.manage":["تعديل ونشر","Manage"],"users.view":["عرض الفريق","View team"],"users.manage":["إدارة الصلاحيات","Manage access"],
};

function PermissionGrid({ar,defaults}:{ar:boolean;defaults:string[]}){return <div className="space-y-3">{groups.map(group=><fieldset key={group.titleEn} className="rounded-xl border border-(--color-line) p-3"><legend className="px-2 text-xs text-(--color-gold)">{ar?group.titleAr:group.titleEn}</legend><div className="flex flex-wrap gap-3">{group.items.map(permission=><label key={permission} className="flex items-center gap-2 text-xs text-(--color-bone)"><input type="checkbox" name="permissions" value={permission} defaultChecked={defaults.includes(permission)} className="accent-(--color-gold)"/>{labels[permission][ar?0:1]}</label>)}</div></fieldset>)}</div>}

export default async function UsersPage({params}:{params:Promise<{locale:Locale}>}){
  const {locale}=await params;const access=await requirePermission(locale,"users.view");const canManage=access.permissions.includes("users.manage");const supabase=getSupabaseClient();const {data:profiles}=supabase?await supabase.from("profiles").select("id,email,full_name,role,permissions,active,created_at").order("created_at",{ascending:false}):{data:[]};const ar=locale==="ar";
  return <div className="mx-auto max-w-6xl"><div className="mb-6"><h1 className="text-2xl font-semibold">{ar?"المستخدمون والصلاحيات":"Users & permissions"}</h1><p className="mt-1 text-sm text-(--color-smoke)">{ar?"حدّد لكل مستخدم الصفحات والعمليات المسموحة بدقة.":"Choose exactly which pages and actions each user can access."}</p></div>
  {!supabase&&<div className="mb-5 rounded-xl border border-(--color-gold)/25 bg-(--color-gold)/10 p-4 text-sm text-(--color-gold)">{ar?"أضف مفتاح خدمة Supabase وشغّل تحديث قاعدة البيانات لتفعيل المستخدمين فعلياً.":"Add the Supabase service key and run the database migration to activate user management."}</div>}
  <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
    {canManage&&<Card><CardHeader><CardTitle className="flex items-center gap-2"><UserPlus size={17}/>{ar?"مستخدم جديد":"New user"}</CardTitle></CardHeader><CardContent><form action={createUserAction.bind(null,locale)} className="space-y-3"><Input name="fullName" required placeholder={ar?"اسم المستخدم":"Full name"}/><Input name="email" type="email" required placeholder="name@company.com"/><Input name="password" type="password" required minLength={8} placeholder={ar?"كلمة مرور مؤقتة":"Temporary password"}/><select name="role" defaultValue="viewer" className="h-10 w-full rounded-lg border border-(--color-line) bg-(--color-ink) px-3 text-sm"><option value="viewer">Viewer</option><option value="editor">Editor</option><option value="admin">Admin</option></select><PermissionGrid ar={ar} defaults={ROLE_PERMISSIONS.viewer}/><Button disabled={!supabase} className="w-full">{ar?"إنشاء المستخدم":"Create user"}</Button></form></CardContent></Card>}
    <Card className={canManage?"":"lg:col-span-2"}><CardHeader><CardTitle className="flex items-center gap-2"><Users size={17}/>{ar?"الفريق":"Team"}</CardTitle></CardHeader><CardContent className="space-y-3">{profiles?.map(p=>{const owner=p.role==="owner";const defaults=owner?[...PERMISSIONS]:((p.permissions as string[]|null)?.length?p.permissions:ROLE_PERMISSIONS[(p.role as "admin"|"editor"|"viewer")??"viewer"]);return <details key={p.id} className="rounded-xl border border-(--color-line) p-3"><summary className="flex cursor-pointer list-none items-center justify-between gap-3"><div><p className="text-sm">{p.full_name||p.email}</p><p className="text-xs text-(--color-smoke)">{p.email}</p></div><div className="flex items-center gap-2"><Badge>{owner?(ar?"المالك الرئيسي":"Owner"):p.role}</Badge><Badge className={p.active?"border-emerald-400/30 text-emerald-400":"border-red-400/30 text-red-400"}>{p.active?(ar?"نشط":"Active"):(ar?"معطل":"Disabled")}</Badge></div></summary>{canManage&&!owner&&<div className="mt-4 border-t border-(--color-line) pt-4"><form action={updateUserPermissionsAction.bind(null,locale,p.id)} className="space-y-3"><select name="role" defaultValue={p.role} className="h-10 w-full rounded-lg border border-(--color-line) bg-(--color-ink) px-3 text-sm"><option value="viewer">Viewer</option><option value="editor">Editor</option><option value="admin">Admin</option></select><PermissionGrid ar={ar} defaults={defaults as string[]}/><div className="flex gap-2"><Button size="sm">{ar?"حفظ الصلاحيات":"Save permissions"}</Button></div></form><form action={toggleUserAction.bind(null,locale,p.id,!p.active)} className="mt-2"><Button size="sm" variant="outline">{p.active?(ar?"تعطيل الحساب":"Disable account"):(ar?"تفعيل الحساب":"Enable account")}</Button></form></div>}</details>})}{!profiles?.length&&<p className="py-8 text-center text-sm text-(--color-smoke)">{ar?"لا يوجد مستخدمون بعد":"No users yet"}</p>}</CardContent></Card>
  </div></div>;
}
