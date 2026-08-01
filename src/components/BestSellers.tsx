import CatalogCard from "./CatalogCard";
import type { Catalog } from "@/lib/types";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";

export default function BestSellers({
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
    <section id="best-sellers" className="py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-12 max-w-2xl"><p className="mb-3 text-[10px] uppercase tracking-[.32em] text-(--color-gold)">{locale === "ar" ? "اختيار المندوبين" : "Sales team picks"}</p><h2 className="font-(family-name:--font-display) text-4xl text-(--color-ivory) md:text-5xl">{dict.sections.bestSellers}</h2>{description && <p className="mt-4 text-sm leading-7 text-(--color-smoke)">{description}</p>}</div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {catalogs.map((c) => (
            <CatalogCard key={c.id} catalog={c} locale={locale} dict={dict} />
          ))}
        </div>
      </div>
    </section>
  );
}
