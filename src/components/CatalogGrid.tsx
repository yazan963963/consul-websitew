"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import CatalogCard from "./CatalogCard";
import type { Catalog, Category } from "@/lib/types";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";

export default function CatalogGrid({
  catalogs,
  categories,
  locale,
  dict,
  description,
  title,
  hideCategories = false,
}: {
  catalogs: Catalog[];
  categories: Category[];
  locale: Locale;
  dict: Dictionary;
  description?: string;
  title?: string;
  hideCategories?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return catalogs.filter((c) => {
      const name = (locale === "ar" ? c.nameAr : c.nameEn).toLowerCase();
      const matchesQuery = name.includes(query.toLowerCase());
      const matchesCategory = activeCategory ? c.category === activeCategory : true;
      return matchesQuery && matchesCategory;
    });
  }, [catalogs, query, activeCategory, locale]);

  return (
    <div id="catalogs" className="mx-auto max-w-7xl px-5 py-24 md:px-8 lg:py-32">
      <div className="mb-12 grid items-end gap-8 lg:grid-cols-[1fr_auto]">
        <div><p className="mb-3 text-[10px] uppercase tracking-[.32em] text-(--color-gold)">{locale === "ar" ? "مكتبة المبيعات" : "Sales library"}</p><h2 className="font-(family-name:--font-display) text-4xl text-(--color-ivory) md:text-6xl">
          {title ?? dict.sections.allCatalogs}
        </h2>{description && <p className="mt-4 max-w-xl text-sm leading-7 text-(--color-smoke)">{description}</p>}</div>

        <div className="relative w-full lg:w-96">
          <Search size={16} className="absolute start-4 top-1/2 -translate-y-1/2 text-(--color-smoke)" />
          <input
            id="site-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={dict.nav.search}
            className="w-full rounded-2xl border border-(--color-line) bg-(--color-surface) py-4 ps-11 pe-4 text-sm text-(--color-ivory) shadow-xl shadow-black/5 outline-none transition focus:border-(--color-gold)"
          />
        </div>

        {!hideCategories && <div className="flex flex-wrap gap-2 lg:col-span-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={`rounded-full border px-4 py-1.5 text-xs transition ${
              activeCategory === null
                ? "border-(--color-gold) text-(--color-gold)"
                : "border-(--color-line) text-(--color-bone) hover:border-(--color-gold)/50"
            }`}
          >
            {dict.filters.all}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.slug)}
              className={`rounded-full border px-4 py-1.5 text-xs transition ${
                activeCategory === cat.slug
                  ? "border-(--color-gold) text-(--color-gold)"
                  : "border-(--color-line) text-(--color-bone) hover:border-(--color-gold)/50"
              }`}
            >
              {locale === "ar" ? cat.nameAr : cat.nameEn}
            </button>
          ))}
        </div>}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c, i) => (
          <CatalogCard key={c.id} catalog={c} locale={locale} dict={dict} priority={i < 3} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-16 text-center text-(--color-smoke)">—</p>
      )}
    </div>
  );
}
