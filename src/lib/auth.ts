import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSupabaseAuthClient, getSupabaseClient } from "./supabase/client";

const COOKIE_NAME = "consul-admin";
const TOKEN_COOKIE = "consul-access-token";
export type AdminRole = "admin" | "editor" | "viewer";

export async function getAdminRole(): Promise<AdminRole | null> {
  const store = await cookies();
  if (store.get(COOKIE_NAME)?.value === "granted") return "admin";
  const token = store.get(TOKEN_COOKIE)?.value;
  if (!token) return null;
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return null;
  const { data: profile } = await supabase.from("profiles").select("role, active").eq("id", data.user.id).maybeSingle();
  if (profile?.active === false) return null;
  const role = profile?.role as AdminRole | undefined;
  return role && ["admin", "editor", "viewer"].includes(role) ? role : "viewer";
}

/**
 * Placeholder-mode admin gate: a single shared password stored in
 * ADMIN_PASSWORD (see .env.example), guarding a signed marker cookie.
 * This is intentionally simple. Once Supabase is connected, swap this
 * for Supabase Auth (email/password or magic link) — see DEPLOYMENT.md.
 */
export async function isAdmin(): Promise<boolean> {
  return (await getAdminRole()) !== null;
}

export async function grantAdmin() {
  const store = await cookies();
  store.set(COOKIE_NAME, "granted", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 8, // 8 hours
    path: "/",
  });
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
    if (profile?.active === false || !["admin", "editor", "viewer"].includes(profile?.role ?? "admin")) return false;
  }
  const store = await cookies();
  store.set(TOKEN_COOKIE, data.session.access_token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: data.session.expires_in, path: "/" });
  return true;
}

export function checkPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD || "consul2026";
  return input === expected;
}

export async function requireAdmin(locale: string) {
  const ok = await isAdmin();
  if (!ok) redirect(`/${locale}/admin/login`);
}

export async function requireEditor(locale: string) {
  const role = await getAdminRole();
  if (!role) redirect(`/${locale}/admin/login`);
  if (role === "viewer") redirect(`/${locale}/admin?error=forbidden`);
}

export async function requireSuperAdmin(locale: string) {
  const role = await getAdminRole();
  if (!role) redirect(`/${locale}/admin/login`);
  if (role !== "admin") redirect(`/${locale}/admin?error=forbidden`);
}
