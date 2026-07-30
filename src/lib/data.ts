import type { Catalog, Category } from "./types";
import seed from "./seed-catalogs.json";
import categoriesSeed from "./seed-categories.json";

/**
 * ─────────────────────────────────────────────────────────────────
 * DATA LAYER
 * ─────────────────────────────────────────────────────────────────
 * This file is the ONLY place the rest of the app talks to for data.
 * Right now it reads from local seed JSON (placeholder mode), so the
 * whole site works with zero external accounts.
 *
 * When Supabase credentials are added (see /src/lib/supabase/client.ts
 * and DEPLOYMENT.md), replace the body of each function below with a
 * Supabase query. The function signatures are designed to stay the
 * same, so no other file needs to change.
 *
 * IMPORTANT (placeholder mode only): writes from the Admin Panel are
 * kept in memory for the running server process. On serverless hosts
 * (Vercel) that memory is not shared/persisted across requests or
 * deployments. This is expected — it goes away the moment Supabase is
 * connected, which is the intended next step before going live.
 * ─────────────────────────────────────────────────────────────────
 */

let memoryCatalogs: Catalog[] = JSON.parse(JSON.stringify(seed)) as Catalog[];
const memoryCategories: Category[] = categoriesSeed as Category[];

export async function getCatalogs(): Promise<Catalog[]> {
  return [...memoryCatalogs].sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getFeaturedCatalogs(): Promise<Catalog[]> {
  return (await getCatalogs()).filter((c) => c.featured);
}

export async function getNewArrivals(): Promise<Catalog[]> {
  return (await getCatalogs()).filter((c) => c.isNew);
}

export async function getBestSellers(): Promise<Catalog[]> {
  return (await getCatalogs()).filter((c) => c.bestSeller);
}

export async function getCatalogBySlug(slug: string): Promise<Catalog | undefined> {
  return memoryCatalogs.find((c) => c.slug === slug);
}

export async function getCategories(): Promise<Category[]> {
  return memoryCategories;
}

export async function createCatalog(catalog: Catalog): Promise<Catalog> {
  memoryCatalogs.push(catalog);
  return catalog;
}

export async function updateCatalog(id: string, patch: Partial<Catalog>): Promise<Catalog | undefined> {
  const idx = memoryCatalogs.findIndex((c) => c.id === id);
  if (idx === -1) return undefined;
  memoryCatalogs[idx] = { ...memoryCatalogs[idx], ...patch };
  return memoryCatalogs[idx];
}

export async function deleteCatalog(id: string): Promise<void> {
  memoryCatalogs = memoryCatalogs.filter((c) => c.id !== id);
}

export async function reorderCatalogs(orderedIds: string[]): Promise<void> {
  orderedIds.forEach((id, index) => {
    const c = memoryCatalogs.find((x) => x.id === id);
    if (c) c.sortOrder = index;
  });
}
