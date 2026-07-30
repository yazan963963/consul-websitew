"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Menu, X } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";
import ThemeToggle from "./ThemeToggle";

export default function Navbar({ locale, dict }: { locale: Locale; dict: Dictionary }) {
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
    { href: `/${locale}#catalogs`, label: dict.nav.catalogs },
    { href: `/${locale}#new-arrivals`, label: dict.nav.newArrivals },
    { href: `/${locale}#best-sellers`, label: dict.nav.bestSellers },
  ];

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled ? "glass" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <Link href={`/${locale}`} className="font-(family-name:--font-display) text-xl tracking-[0.25em] text-(--color-ivory)">
          CONSUL<span className="text-(--color-gold)">.</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-(--color-bone) transition hover:text-(--color-gold)">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            aria-label={dict.nav.search}
            onClick={() => document.getElementById("site-search")?.focus()}
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
        <div className="glass flex flex-col gap-4 px-5 py-6 md:hidden">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-(--color-ivory)">
              {l.label}
            </a>
          ))}
        </div>
      )}
    </motion.header>
  );
}
