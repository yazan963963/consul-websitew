"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Catalog } from "@/lib/types";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";

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
        <div className="relative aspect-[16/10] overflow-hidden bg-[radial-gradient(circle_at_center,rgba(198,154,62,.09),transparent_65%)]">
          <Image
            src={catalog.coverUrl}
            alt={name}
            fill
            priority={priority}
            sizes="(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 30vw"
            className="object-contain p-2 transition-transform duration-700 ease-out group-hover:scale-[1.025]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/15 via-45% to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-[radial-gradient(ellipse_at_bottom,rgba(0,0,0,.82),transparent_72%)]" />
          <div className="absolute inset-3 rounded-[1.15rem] border border-white/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          {catalog.isNew && (
            <span className="absolute start-4 top-4 rounded-full bg-(--color-gold) px-3 py-1 text-[10px] font-semibold tracking-wide text-(--color-ink)">
              {dict.catalog.new}
            </span>
          )}

          <div className="absolute inset-x-0 bottom-0 p-5">
            <p className="text-[11px] uppercase tracking-[0.2em] text-(--color-gold) [text-shadow:0_2px_10px_rgba(0,0,0,1)]">{locale === "ar" ? "مجموعة CONSUL" : "CONSUL COLLECTION"}</p>
            <h3 className="mt-1 font-(family-name:--font-display) text-xl text-white [text-shadow:0_2px_14px_rgba(0,0,0,1)]">{name}</h3>
            <div className="mt-2 flex items-center justify-between text-xs text-white/80 [text-shadow:0_2px_8px_rgba(0,0,0,1)]">
              <span>
                {catalog.images.length} {locale === "ar" ? "صورة" : "images"}
              </span>
              <span>{locale === "ar" ? "جاهز للعرض" : "Ready to present"}</span>
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
