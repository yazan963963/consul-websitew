import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { getCatalogs } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const catalogs = await getCatalogs();

  const entries: MetadataRoute.Sitemap = [];
  for (const locale of locales) {
    entries.push({ url: `${siteUrl}/${locale}`, changeFrequency: "daily", priority: 1 });
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
