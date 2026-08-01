import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { loginAction } from "@/lib/actions";

export default async function AdminLoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { locale } = await params;
  const { error } = await searchParams;
  const dict = await getDictionary(locale);
  const action = loginAction.bind(null, locale);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-6 py-16">
      <h1 className="mb-6 text-center font-(family-name:--font-display) text-2xl text-(--color-ivory)">
        {dict.admin.title}
      </h1>
      <form action={action} className="flex flex-col gap-4 rounded-2xl border border-(--color-line) bg-(--color-surface) p-6">
        <input
          type="email"
          name="email"
          placeholder={locale === "ar" ? "البريد الإلكتروني (Supabase)" : "Email (Supabase)"}
          className="rounded-lg border border-(--color-line) bg-(--color-ink) px-4 py-3 text-(--color-ivory) outline-none focus:border-(--color-gold)"
        />
        <input
          type="password"
          name="password"
          placeholder="••••••••"
          required
          className="rounded-lg border border-(--color-line) bg-(--color-ink) px-4 py-3 text-(--color-ivory) outline-none focus:border-(--color-gold)"
        />
        {error && <p className="text-xs text-red-400">كلمة المرور غير صحيحة</p>}
        <button
          type="submit"
          className="rounded-lg bg-(--color-gold) py-3 text-sm font-medium text-(--color-ink) transition hover:opacity-90"
        >
          {dict.admin.save}
        </button>
      </form>
    </div>
  );
}
