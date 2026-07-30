"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { grantAdmin, revokeAdmin, checkPassword } from "./auth";
import { createCatalog, deleteCatalog, updateCatalog } from "./data";
import type { Catalog } from "./types";

export async function loginAction(locale: string, formData: FormData) {
  const password = String(formData.get("password") ?? "");
  if (!checkPassword(password)) {
    redirect(`/${locale}/admin/login?error=1`);
  }
  await grantAdmin();
  redirect(`/${locale}/admin`);
}

export async function logoutAction(locale: string) {
  await revokeAdmin();
  redirect(`/${locale}/admin/login`);
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u0600-\u06FF\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function createCatalogAction(locale: string, formData: FormData) {
  const nameAr = String(formData.get("nameAr") ?? "");
  const nameEn = String(formData.get("nameEn") ?? "");
  const category = String(formData.get("category") ?? "");
  const coverUrl = String(formData.get("coverUrl") ?? "");
  const productCount = Number(formData.get("productCount") ?? 0);
  let slug = String(formData.get("slug") ?? "");
  if (!slug) slug = slugify(nameEn || nameAr);

  const catalog: Catalog = {
    id: `cat-${Date.now()}`,
    slug: slugify(slug),
    nameAr,
    nameEn,
    category,
    coverUrl: coverUrl || "https://picsum.photos/seed/" + slug + "/1200/1500",
    images: [],
    productCount,
    updatedAt: new Date().toISOString().slice(0, 10),
    featured: formData.get("featured") === "on",
    isNew: formData.get("isNew") === "on",
    bestSeller: formData.get("bestSeller") === "on",
    sortOrder: 999,
  };

  await createCatalog(catalog);
  revalidatePath(`/${locale}`);
  redirect(`/${locale}/admin`);
}

export async function deleteCatalogAction(locale: string, id: string) {
  await deleteCatalog(id);
  revalidatePath(`/${locale}`);
  revalidatePath(`/${locale}/admin`);
}

export async function toggleFlagAction(
  locale: string,
  id: string,
  flag: "featured" | "isNew" | "bestSeller",
  value: boolean
) {
  await updateCatalog(id, { [flag]: value });
  revalidatePath(`/${locale}`);
  revalidatePath(`/${locale}/admin`);
}
