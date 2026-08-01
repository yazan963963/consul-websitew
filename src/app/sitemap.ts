import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { getCatalogs, getWarehouses } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const [catalogs, warehouses] = await Promise.all([getCatalogs(), getWarehouses()]);

  const entries: MetadataRoute.Sitemap = [];
  for (const locale of locales) {
    entries.push({ url: `${siteUrl}/${locale}`, changeFrequency: "daily", priority: 1 });
    entries.push({ url: `${siteUrl}/${locale}/catalogs`, changeFrequency: "daily", priority: 0.9 });
    entries.push({ url: `${siteUrl}/${locale}/warehouses`, changeFrequency: "daily", priority: 0.9 });
    for (const warehouse of warehouses) entries.push({ url: `${siteUrl}/${locale}/warehouses/${warehouse.slug}`, changeFrequency: "daily", priority: 0.9 });
    for (const c of catalogs) {
      entries.push({
        url: `${siteUrl}/${locale}/catalog/${c.slug}`,
        lastModified: c.updatedAt,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  }
  return entries;
}
