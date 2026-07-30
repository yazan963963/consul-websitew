import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "consul-admin";

/**
 * Placeholder-mode admin gate: a single shared password stored in
 * ADMIN_PASSWORD (see .env.example), guarding a signed marker cookie.
 * This is intentionally simple. Once Supabase is connected, swap this
 * for Supabase Auth (email/password or magic link) — see DEPLOYMENT.md.
 */
export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value === "granted";
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
}

export function checkPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD || "consul2026";
  return input === expected;
}

export async function requireAdmin(locale: string) {
  const ok = await isAdmin();
  if (!ok) redirect(`/${locale}/admin/login`);
}
