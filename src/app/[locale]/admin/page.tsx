import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { requireAdmin } from "@/lib/auth";
import { getCatalogs } from "@/lib/data";
import { deleteCatalogAction, logoutAction, toggleFlagAction } from "@/lib/actions";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export default async function AdminDashboard({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  await requireAdmin(locale);
  const dict = await getDictionary(locale);
  const catalogs = await getCatalogs();
  const logout = logoutAction.bind(null, locale);

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 md:px-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-(family-name:--font-display) text-3xl text-(--color-ivory)">{dict.admin.title}</h1>
        <div className="flex items-center gap-3">
          <Link
            href={`/${locale}/admin/catalogs/new`}
            className="rounded-full bg-(--color-gold) px-5 py-2 text-sm font-medium text-(--color-ink)"
          >
            + {dict.admin.addNew}
          </Link>
          <form action={logout}>
            <button className="rounded-full border border-(--color-line) px-4 py-2 text-sm text-(--color-bone)">
              خروج
            </button>
          </form>
        </div>
      </div>

      {!isSupabaseConfigured && (
        <div className="mb-8 rounded-xl border border-(--color-gold)/30 bg-(--color-gold)/5 p-4 text-sm text-(--color-gold)">
          وضع Placeholder: التعديلات هنا تُحفظ مؤقتاً في ذاكرة الخادم فقط ولن تبقى بعد إعادة النشر. اربط Supabase
          (راجع DEPLOYMENT.md) ليصبح الحفظ دائماً.
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-(--color-line)">
        <table className="w-full text-start text-sm">
          <thead className="bg-(--color-surface) text-(--color-bone)">
            <tr>
              <th className="px-4 py-3 text-start">{dict.admin.cover}</th>
              <th className="px-4 py-3 text-start">{dict.admin.name}</th>
              <th className="px-4 py-3 text-start">{dict.admin.category}</th>
              <th className="px-4 py-3 text-start">{dict.admin.featured}</th>
              <th className="px-4 py-3 text-start">{dict.admin.newBadge}</th>
              <th className="px-4 py-3 text-start">{dict.admin.bestSeller}</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {catalogs.map((c) => (
              <tr key={c.id} className="border-t border-(--color-line)">
                <td className="px-4 py-3">
                  <div className="relative h-12 w-10 overflow-hidden rounded-md">
                    <Image src={c.coverUrl} alt="" fill className="object-cover" />
                  </div>
                </td>
                <td className="px-4 py-3 text-(--color-ivory)">{locale === "ar" ? c.nameAr : c.nameEn}</td>
                <td className="px-4 py-3 text-(--color-bone)">{c.category}</td>
                {(["featured", "isNew", "bestSeller"] as const).map((flag) => (
                  <td key={flag} className="px-4 py-3">
                    <form action={toggleFlagAction.bind(null, locale, c.id, flag, !c[flag])}>
                      <button
                        className={`h-5 w-9 rounded-full transition ${
                          c[flag] ? "bg-(--color-gold)" : "bg-(--color-line)"
                        }`}
                        aria-label={flag}
                      >
                        <span
                          className={`block h-4 w-4 translate-y-0.5 rounded-full bg-(--color-ink) transition ${
                            c[flag] ? "translate-x-4" : "translate-x-0.5"
                          }`}
                        />
                      </button>
                    </form>
                  </td>
                ))}
                <td className="px-4 py-3 text-end">
                  <form action={deleteCatalogAction.bind(null, locale, c.id)}>
                    <button className="text-xs text-red-400 hover:underline">{dict.admin.delete}</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {catalogs.length === 0 && (
          <p className="p-8 text-center text-(--color-smoke)">{dict.admin.noCatalogs}</p>
        )}
      </div>
    </div>
  );
}
