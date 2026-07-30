import CatalogCard from "./CatalogCard";
import type { Catalog } from "@/lib/types";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";

export default function BestSellers({
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
    <section id="best-sellers" className="py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <h2 className="mb-10 font-(family-name:--font-display) text-3xl text-(--color-ivory)">
          {dict.sections.bestSellers}
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {catalogs.map((c) => (
            <CatalogCard key={c.id} catalog={c} locale={locale} dict={dict} />
          ))}
        </div>
      </div>
    </section>
  );
}
