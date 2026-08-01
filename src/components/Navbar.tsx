"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Search, Menu, X } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";
import ThemeToggle from "./ThemeToggle";

export default function Navbar({ locale, dict, whatsapp }: { locale: Locale; dict: Dictionary; whatsapp?: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const otherLocale: Locale = locale === "ar" ? "en" : "ar";
  const switchHref = pathname.replace(`/${locale}`, `/${otherLocale}`) || `/${otherLocale}`;

  const links = [
    { href: `/${locale}/warehouses`, label: locale === "ar" ? "المستودعات" : "Warehouses" },
    { href: `/${locale}/catalogs`, label: dict.nav.catalogs },
    { href: `/${locale}#new-arrivals`, label: dict.nav.newArrivals },
    { href: `/${locale}#best-sellers`, label: dict.nav.bestSellers },
  ];

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed inset-x-0 top-0 z-50 px-3 pt-3"
    >
      <div className={`mx-auto flex max-w-7xl items-center justify-between rounded-2xl border px-4 py-3 transition-all duration-500 md:px-5 ${scrolled ? "border-(--color-gold)/15 bg-(--color-ink)/80 shadow-2xl shadow-black/20 backdrop-blur-2xl" : "border-white/8 bg-(--color-ink)/35 backdrop-blur-md"}`}>
        <Link href={`/${locale}`} aria-label="CONSUL" className="relative h-11 w-24 shrink-0">
          <Image src="/brand/consul-logo-transparent.png" alt="CONSUL" fill priority sizes="96px" className="object-contain" />
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-(--color-line) bg-(--color-surface)/45 p-1 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="rounded-full px-4 py-2 text-xs text-(--color-bone) transition hover:bg-(--color-surface-2) hover:text-(--color-gold)">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {whatsapp && <a href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="hidden rounded-full border border-(--color-line) p-2 text-(--color-gold) transition hover:border-(--color-gold) md:inline-flex"><MessageCircle size={16}/></a>}
          <button
            aria-label={dict.nav.search}
            onClick={() => {
              const search = document.getElementById("site-search");
              if (search) search.focus();
              else router.push(`/${locale}/catalogs`);
            }}
            className="hidden rounded-full border border-(--color-line) p-2 text-(--color-ivory) transition hover:border-(--color-gold) hover:text-(--color-gold) md:inline-flex"
          >
            <Search size={16} />
          </button>
          <ThemeToggle />
          <button
            onClick={() => router.push(switchHref)}
            className="rounded-full border border-(--color-line) px-3 py-1.5 text-xs tracking-wide text-(--color-ivory) transition hover:border-(--color-gold) hover:text-(--color-gold)"
          >
            {otherLocale.toUpperCase()}
          </button>
          <button
            className="rounded-full border border-(--color-line) p-2 text-(--color-ivory) md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="menu"
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="mx-auto mt-2 flex max-w-7xl flex-col gap-2 rounded-2xl border border-(--color-line) bg-(--color-ink)/95 p-4 shadow-2xl backdrop-blur-2xl md:hidden">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-xl px-3 py-3 text-sm text-(--color-ivory) hover:bg-(--color-surface)">
              {l.label}
            </a>
          ))}
        </div>
      )}
    </motion.header>
  );
}
