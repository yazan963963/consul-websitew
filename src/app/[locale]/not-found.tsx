import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-6 text-center">
      <p className="mb-2 font-(family-name:--font-display) text-6xl text-(--color-gold)">404</p>
      <p className="mb-6 text-(--color-bone)">هذه الصفحة غير موجودة — This page could not be found.</p>
      <Link href="/" className="gold-underline text-sm text-(--color-gold)">
        العودة للرئيسية
      </Link>
    </div>
  );
}
