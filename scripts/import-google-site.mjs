import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const site = "https://sites.google.com";
const branches = [
  { id: "warehouse-makkah", slug: "makkah", path: "/view/consulbags/makkah-items", prefix: "branch-makkah" },
  { id: "warehouse-jeddah", slug: "jeddah", path: "/view/consulbags/jeddah-items", prefix: "branch-jeddah" },
  { id: "warehouse-madinah", slug: "madinah", path: "/view/consulbags/madinah-items", prefix: "branch-madinah" },
];

const clean = (value) => value.replace(/<[^>]+>/g, " ").replaceAll("&amp;", "&").replace(/\s+/g, " ").trim();
const safeSlug = (value) => value.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g, "");

async function fetchText(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response.text();
}

async function runPool(items, worker, limit = 5) {
  const results = new Array(items.length); let cursor = 0;
  async function run() { while (cursor < items.length) { const index = cursor++; results[index] = await worker(items[index], index); } }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, run));
  return results;
}

const sections = [];
for (const branch of branches) {
  const html = await fetchText(site + branch.path);
  const links = new Map();
  const pattern = new RegExp(`<a[^>]+href="([^"]*\\/view\\/consulbags\\/${branch.prefix}\\/[^"]+)"[^>]*>([\\s\\S]*?)<\\/a>`, "g");
  for (const match of html.matchAll(pattern)) {
    const label = clean(match[2]); if (!label) continue;
    const labels = links.get(match[1]) ?? new Set(); labels.add(label); links.set(match[1], labels);
  }
  const branchSections = [...links].map(([href, labels], sortOrder) => {
    const combined = [...labels].sort((a, b) => b.length - a.length)[0];
    const [english, ...arabicParts] = combined.split("/");
    const slug = safeSlug(href.split("/").at(-1));
    return { id: `${branch.slug}-${slug}`, warehouseId: branch.id, warehouseSlug: branch.slug, slug, nameEn: clean(english), nameAr: clean(arabicParts.join("/")) || clean(english), sourceUrl: site + href, sortOrder };
  });
  sections.push(...branchSections);
}

await runPool(sections, async (section) => {
  const html = await fetchText(section.sourceUrl);
  const imageUrls = [...new Set([...html.matchAll(/https:\/\/lh3\.googleusercontent\.com\/sitesv\/[^"'\\) ;]+/g)].map((match) => match[0].replaceAll("\\u003d", "=").replaceAll("\\u0026", "&")).filter((url) => /=w1280$/.test(url)))];
  const destination = path.join("public", "imported-catalogs", section.warehouseSlug, section.slug);
  await mkdir(destination, { recursive: true });
  section.images = await runPool(imageUrls, async (url, index) => {
    const response = await fetch(url); if (!response.ok) throw new Error(`${response.status} ${url}`);
    const type = response.headers.get("content-type") ?? "image/jpeg";
    const extension = type.includes("png") ? "png" : type.includes("webp") ? "webp" : "jpeg";
    const filename = `page-${String(index + 1).padStart(2, "0")}.${extension}`;
    await writeFile(path.join(destination, filename), Buffer.from(await response.arrayBuffer()));
    return `/imported-catalogs/${section.warehouseSlug}/${section.slug}/${filename}`;
  }, 3);
  console.log(`${section.warehouseSlug}/${section.slug}: ${section.images.length}`);
}, 4);

await writeFile("src/lib/legacy-import.json", JSON.stringify(sections, null, 2) + "\n");
console.log(`Imported ${sections.length} sections and ${sections.reduce((sum, section) => sum + section.images.length, 0)} images.`);
