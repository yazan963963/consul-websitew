import CatalogCard from "./CatalogCard";
import type { Catalog } from "@/lib/types";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";

export default function NewArrivals({
  catalogs,
  locale,
  dict,
}: {
  catalogs: Catalog[];
  locale: Locale;
  dict: Dictionary;
}) {
  if (catalogs.length === 0) return null;

  return (
    <section id="new-arrivals" className="bg-(--color-surface)/40 py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-10 flex items-end justify-between">
          <h2 className="font-(family-name:--font-display) text-3xl text-(--color-ivory)">
            {dict.sections.newArrivals}
          </h2>
        </div>
        <div className="scrollbar-none -mx-5 flex snap-x gap-5 overflow-x-auto px-5 pb-4 md:mx-0 md:px-0">
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
