import CatalogCard from "./CatalogCard";
import type { Catalog } from "@/lib/types";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";

export default function NewArrivals({
  catalogs,
  locale,
  dict,
  description,
}: {
  catalogs: Catalog[];
  locale: Locale;
  dict: Dictionary;
  description?: string;
}) {
  if (catalogs.length === 0) return null;

  return (
    <section id="new-arrivals" className="relative overflow-hidden border-y border-(--color-line) bg-(--color-surface)/35 py-24">
      <div className="absolute end-0 top-0 h-full w-1/2 bg-[radial-gradient(circle_at_top_right,rgba(201,162,39,.08),transparent_65%)]" />
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="relative mb-12 flex items-end justify-between">
          <div><p className="mb-3 text-[10px] uppercase tracking-[.32em] text-(--color-gold)">CONSUL / 2026</p><h2 className="font-(family-name:--font-display) text-4xl text-(--color-ivory) md:text-5xl">
            {dict.sections.newArrivals}
          </h2></div>{description && <p className="hidden max-w-xs text-end text-sm leading-6 text-(--color-smoke) md:block">{description}</p>}
        </div>
        <div className="scrollbar-none relative -mx-5 flex snap-x gap-6 overflow-x-auto px-5 pb-4 md:mx-0 md:px-0">
          {catalogs.map((c) => (
            <div key={c.id} className="w-72 shrink-0 snap-start md:w-80">
              <CatalogCard catalog={c} locale={locale} dict={dict} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
