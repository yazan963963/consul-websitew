import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { requireAdmin } from "@/lib/auth";
import { getCategories } from "@/lib/data";
import { createCatalogAction } from "@/lib/actions";

export default async function NewCatalogPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  await requireAdmin(locale);
  const dict = await getDictionary(locale);
  const categories = await getCategories();
  const action = createCatalogAction.bind(null, locale);

  const inputClass =
    "w-full rounded-lg border border-(--color-line) bg-(--color-ink) px-4 py-3 text-(--color-ivory) outline-none focus:border-(--color-gold)";
  const labelClass = "mb-1.5 block text-xs text-(--color-bone)";

  return (
    <div className="mx-auto max-w-2xl px-5 py-12 md:px-8">
      <h1 className="mb-8 font-(family-name:--font-display) text-2xl text-(--color-ivory)">{dict.admin.addNew}</h1>

      <form action={action} className="flex flex-col gap-5 rounded-2xl border border-(--color-line) bg-(--color-surface) p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass}>{dict.admin.name} (AR)</label>
            <input name="nameAr" required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>{dict.admin.name} (EN)</label>
            <input name="nameEn" required className={inputClass} />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass}>{dict.admin.slug}</label>
            <input name="slug" placeholder="new-arrivals" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>{dict.admin.category}</label>
            <select name="category" className={inputClass}>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {locale === "ar" ? c.nameAr : c.nameEn}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass}>{dict.admin.cover} (URL)</label>
          <input name="coverUrl" placeholder="https://..." className={inputClass} />
          <p className="mt-1 text-[11px] text-(--color-smoke)">
            بدون Cloudinary متصل، ألصق رابط صورة مباشر مؤقتاً. بعد ربط Cloudinary سيصبح هنا زر رفع مباشر.
          </p>
        </div>

        <div>
          <label className={labelClass}>{dict.catalog.products}</label>
          <input name="productCount" type="number" defaultValue={0} className={inputClass} />
        </div>

        <div className="flex flex-wrap gap-6 text-sm text-(--color-ivory)">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="featured" className="accent-(--color-gold)" /> {dict.admin.featured}
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="isNew" className="accent-(--color-gold)" /> {dict.admin.newBadge}
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="bestSeller" className="accent-(--color-gold)" /> {dict.admin.bestSeller}
          </label>
        </div>

        <button
          type="submit"
          className="mt-2 rounded-lg bg-(--color-gold) py-3 text-sm font-medium text-(--color-ink) transition hover:opacity-90"
        >
          {dict.admin.save}
        </button>
      </form>
    </div>
  );
}
