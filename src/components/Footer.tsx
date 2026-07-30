import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";

export default function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <footer className="border-t border-(--color-line) bg-(--color-ink) py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-5 text-center md:px-8">
        <p className="font-(family-name:--font-display) text-lg tracking-[0.3em] text-(--color-ivory)">
          CONSUL<span className="text-(--color-gold)">.</span>
        </p>
        <p className="text-xs text-(--color-smoke)">{dict.footer.salesOnly}</p>
        <p className="text-xs text-(--color-smoke)">
          © {new Date().getFullYear()} CONSUL — {dict.footer.rights}
        </p>
      </div>
    </footer>
  );
}
