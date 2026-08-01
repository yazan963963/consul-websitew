import Link from "next/link";
import type { Catalog, Category, Warehouse } from "@/lib/types";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";

export default function CatalogForm({
  action, catalog, categories, warehouses, locale, dict, error,
}: {
  action: (formData: FormData) => void | Promise<void>;
  catalog?: Catalog;
  categories: Category[];
  warehouses: Warehouse[];
  locale: Locale;
  dict: Dictionary;
  error?: string;
}) {
  const inputClass = "w-full rounded-lg border border-(--color-line) bg-(--color-ink) px-4 py-3 text-(--color-ivory) outline-none focus:border-(--color-gold)";
  const labelClass = "mb-1.5 block text-xs text-(--color-bone)";
  const errorMessage = error === "slug"
    ? (locale === "ar" ? "الرابط المخصص مستخدم مسبقاً." : "This custom link is already in use.")
    : error ? (locale === "ar" ? "يرجى تعبئة جميع الحقول المطلوبة." : "Please complete all required fields.") : null;

  return (
    <form action={action} className="flex flex-col gap-5 rounded-2xl border border-(--color-line) bg-(--color-surface) p-6">
      {errorMessage && <p className="rounded-lg border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-400">{errorMessage}</p>}
      <div className="grid gap-5 sm:grid-cols-2">
        <div><label className={labelClass}>{dict.admin.name} (AR)</label><input name="nameAr" required defaultValue={catalog?.nameAr} className={inputClass} /></div>
        <div><label className={labelClass}>{dict.admin.name} (EN)</label><input name="nameEn" required defaultValue={catalog?.nameEn} className={inputClass} /></div>
      </div>
      <fieldset className="rounded-xl border border-(--color-line) p-4"><legend className="px-2 text-xs text-(--color-bone)">{locale === "ar" ? "المستودعات (اختر واحدًا أو أكثر)" : "Warehouses (select one or more)"}</legend><div className="mt-2 grid gap-3 sm:grid-cols-3">{warehouses.map(warehouse=><label key={warehouse.id} className="flex cursor-pointer items-center gap-2 rounded-lg border border-(--color-line) p-3 text-sm transition hover:border-(--color-gold)/40"><input type="checkbox" name="warehouseIds" value={warehouse.id} defaultChecked={catalog?.warehouseIds.includes(warehouse.id) ?? true} className="accent-(--color-gold)"/><span>{locale === "ar" ? warehouse.nameAr : warehouse.nameEn}</span></label>)}</div></fieldset>
      <div className="grid gap-5 sm:grid-cols-2">
        <div><label className={labelClass}>{dict.admin.slug}</label><input name="slug" placeholder="new-arrivals" defaultValue={catalog?.slug} className={inputClass} /></div>
        <div><label className={labelClass}>{dict.admin.category}</label><select name="category" defaultValue={catalog?.category} className={inputClass}>{categories.map((c) => <option key={c.id} value={c.slug}>{locale === "ar" ? c.nameAr : c.nameEn}</option>)}</select></div>
      </div>
      <div>
        <label className={labelClass}>{dict.admin.cover}</label>
        <input type="hidden" name="existingCoverUrl" value={catalog?.coverUrl ?? ""} />
        <input name="coverFile" type="file" accept="image/*" className={inputClass} />
        {catalog?.coverUrl && <p className="mt-1 text-xs text-(--color-smoke)">{locale === "ar" ? "اتركه فارغاً للاحتفاظ بالغلاف الحالي." : "Leave empty to keep the current cover."}</p>}
      </div>
      <div>
        <label className={labelClass}>{dict.admin.images} — {locale === "ar" ? "يمكن اختيار عدة صور" : "multiple images allowed"}</label>
        <input type="hidden" name="existingImageUrls" value={catalog?.images.map((image) => image.url).join("\n") ?? ""} />
        <input name="catalogImages" type="file" accept="image/*" multiple className={inputClass} />
        {catalog?.images.length ? <p className="mt-1 text-xs text-(--color-smoke)">{locale === "ar" ? `الصور الحالية: ${catalog.images.length}. اختيار صور جديدة سيستبدلها.` : `Current images: ${catalog.images.length}. New selections replace them.`}</p> : null}
      </div>
      <div>
        <label className={labelClass}>PDF</label>
        <input type="hidden" name="existingPdfUrl" value={catalog?.pdfUrl ?? ""} />
        <input name="pdfFile" type="file" accept="application/pdf" className={inputClass} />
      </div>
      <div><label className={labelClass}>{dict.catalog.products}</label><input name="productCount" type="number" min="0" defaultValue={catalog?.productCount ?? 0} className={inputClass} /></div>
      <div><label className={labelClass}>{locale === "ar" ? "الألوان المتوفرة" : "Available colors"}</label><textarea name="colors" defaultValue={catalog?.colors?.join("\n") ?? ""} rows={4} placeholder={locale === "ar" ? "أسود\nذهبي\nوردي" : "Black\nGold\nRose"} className={inputClass}/><p className="mt-1.5 text-xs text-(--color-smoke)">{locale === "ar" ? "اكتب كل لون في سطر، أو افصل الألوان بفاصلة." : "Enter one color per line, or separate colors with commas."}</p></div>
      <div className="flex flex-wrap gap-6 text-sm text-(--color-ivory)">
        <label className="flex items-center gap-2"><input type="checkbox" name="featured" defaultChecked={catalog?.featured} className="accent-(--color-gold)" /> {dict.admin.featured}</label>
        <label className="flex items-center gap-2"><input type="checkbox" name="isNew" defaultChecked={catalog?.isNew} className="accent-(--color-gold)" /> {dict.admin.newBadge}</label>
        <label className="flex items-center gap-2"><input type="checkbox" name="bestSeller" defaultChecked={catalog?.bestSeller} className="accent-(--color-gold)" /> {dict.admin.bestSeller}</label>
      </div>
      <div className="mt-2 flex gap-3">
        <button type="submit" className="flex-1 rounded-lg bg-(--color-gold) py-3 text-sm font-medium text-(--color-ink) transition hover:opacity-90">{dict.admin.save}</button>
        <Link href={`/${locale}/admin`} className="rounded-lg border border-(--color-line) px-5 py-3 text-center text-sm text-(--color-bone)">{dict.admin.cancel}</Link>
      </div>
    </form>
  );
}
