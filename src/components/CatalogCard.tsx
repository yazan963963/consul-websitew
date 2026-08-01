"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Catalog } from "@/lib/types";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";
import { formatDate } from "@/lib/utils";

export default function CatalogCard({
  catalog,
  locale,
  dict,
  priority = false,
}: {
  catalog: Catalog;
  locale: Locale;
  dict: Dictionary;
  priority?: boolean;
}) {
  const name = locale === "ar" ? catalog.nameAr : catalog.nameEn;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{ y: -6 }}
      className="group relative overflow-hidden rounded-[1.6rem] border border-(--color-line) bg-(--color-surface) shadow-[0_20px_70px_rgba(0,0,0,.12)]"
    >
      <Link href={`/${locale}/catalog/${catalog.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-(--color-surface-2)">
          <Image
            src={catalog.coverUrl}
            alt={name}
            fill
            priority={priority}
            sizes="(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 30vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/5 to-transparent" />
          <div className="absolute inset-3 rounded-[1.15rem] border border-white/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          {catalog.isNew && (
            <span className="absolute start-4 top-4 rounded-full bg-(--color-gold) px-3 py-1 text-[10px] font-semibold tracking-wide text-(--color-ink)">
              {dict.catalog.new}
            </span>
          )}

          <div className="absolute inset-x-0 bottom-0 p-5">
            <p className="text-[11px] uppercase tracking-[0.2em] text-(--color-gold)">{catalog.category}</p>
            <h3 className="mt-1 font-(family-name:--font-display) text-xl text-(--color-ivory)">{name}</h3>
            <div className="mt-2 flex items-center justify-between text-xs text-(--color-bone)">
              <span>
                {catalog.productCount} {dict.catalog.products}
              </span>
              <span>{formatDate(catalog.updatedAt, locale)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-5 py-4">
          <span className="text-sm text-(--color-ivory) transition group-hover:text-(--color-gold)">
            {dict.catalog.view}
          </span>
          <ArrowUpRight
            size={16}
            className="text-(--color-gold) transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 rtl:group-hover:-translate-x-1"
          />
        </div>
      </Link>
    </motion.div>
  );
}
