import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSupabaseAuthClient, getSupabaseClient } from "./supabase/client";
import { effectivePermissions, type AdminRole, type Permission } from "./permissions";

const COOKIE_NAME = "consul-admin";
const TOKEN_COOKIE = "consul-access-token";
export type AdminAccess={role:AdminRole;permissions:Permission[];userId:string;email:string;fullName:string};

export async function getAdminAccess(): Promise<AdminAccess | null> {
  const store = await cookies();
  const token = store.get(TOKEN_COOKIE)?.value;
  if (!token) return null;
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return null;
  const { data: profile } = await supabase.from("profiles").select("role, active, permissions, email, full_name").eq("id", data.user.id).maybeSingle();
  if (!profile || profile.active === false) return null;
  const rawRole=profile?.role;
  const role = (["owner","admin","editor","viewer"].includes(rawRole)?rawRole:"viewer") as AdminRole;
  return {
    role,
    permissions:effectivePermissions(role,profile.permissions),
    userId:data.user.id,
    email:profile.email || data.user.email || "",
    fullName:profile.full_name || profile.email || data.user.email || "",
  };
}

export async function getAdminRole(){return (await getAdminAccess())?.role??null}

export async function isAdmin(): Promise<boolean> {
  return (await getAdminAccess()) !== null;
}

export async function revokeAdmin() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
  store.delete(TOKEN_COOKIE);
}

export async function signInAdmin(email: string, password: string): Promise<boolean> {
  const supabase = getSupabaseAuthClient();
  if (!supabase) return false;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.session) return false;
  const admin = getSupabaseClient();
  if (admin) {
    const { data: profile } = await admin.from("profiles").select("role, active").eq("id", data.user.id).maybeSingle();
    if (profile?.active === false || !["owner","admin", "editor", "viewer"].includes(profile?.role ?? "viewer")) return false;
  }
  const store = await cookies();
  store.set(TOKEN_COOKIE, data.session.access_token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: data.session.expires_in, path: "/" });
  return true;
}

export async function requireAdmin(locale: string) {
  const ok = await isAdmin();
  if (!ok) redirect(`/${locale}/admin/login`);
}

export async function requirePermission(locale:string,permission:Permission){
  const access=await getAdminAccess();
  if(!access)redirect(`/${locale}/admin/login`);
  if(!access.permissions.includes(permission))redirect(`/${locale}?error=forbidden`);
  return access;
}

export async function requireEditor(locale: string) {
  return requirePermission(locale,"catalogs.edit");
}

export async function requireSuperAdmin(locale: string) {
  return requirePermission(locale,"users.manage");
}
