# CONSUL — موقع عرض الكاتالوجات لمناديب المبيعات

موقع Next.js 16 مبني بالكامل من الصفر (بدون قوالب جاهزة) لعرض كاتالوجات شركة CONSUL
بتجربة عرض فاخرة، مخصص لمندوبي المبيعات لإرساله للعملاء.

## المكدس التقني

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS v4** (نظام ألوان Black / Gold / White مأخوذ من الشعار)
- **Framer Motion** للحركات والانتقالات
- **Supabase** لقاعدة البيانات + المصادقة (اختياري، انظر أدناه)
- **Cloudinary** لرفع وتحسين الصور (اختياري)
- i18n داخلي (عربي RTL / إنجليزي) بدون مكتبات خارجية ثقيلة
- PWA (manifest + service worker بسيط)

## وضع التشغيل الحالي: Placeholder Mode

المشروع الآن يعمل **بدون أي حسابات خارجية**. البيانات (6 كاتالوجات تجريبية بصور
placeholder) موجودة في:

```
src/lib/seed-catalogs.json
src/lib/seed-categories.json
```

لوحة التحكم (`/ar/admin`) تعمل وتقدر تضيف/تحذف/تعدّل كاتالوجات، لكن التعديلات
تُحفظ في ذاكرة السيرفر فقط (تُفقد عند إعادة تشغيل أو نشر جديد). هذا وضع تجريبي
مقصود — بمجرد ربط Supabase (خطوات في `DEPLOYMENT.md`) يصبح الحفظ دائم بدون أي
تعديل على واجهة الموقع.

## التشغيل محلياً

```bash
npm install
cp .env.example .env.local
npm run dev
```

افتح http://localhost:3000 — سيحولك تلقائياً إلى `/ar`.

كلمة مرور لوحة التحكم الافتراضية: `consul2026` (غيّرها من `ADMIN_PASSWORD` في
`.env.local` قبل النشر الفعلي).

## بنية المشروع

```
src/
  app/[locale]/           كل الصفحات (ar/en تلقائياً)
    page.tsx              الصفحة الرئيسية
    catalog/[slug]/        صفحة عرض الكاتالوج (Apple-style viewer)
    admin/                 لوحة التحكم
  components/              كل مكونات الواجهة
  lib/
    data.ts                طبقة البيانات الوحيدة التي يتكلم معها الموقع
    supabase/               عميل Supabase + schema.sql جاهز
    actions.ts              Server Actions (تسجيل الدخول، إضافة/حذف كاتالوج)
  i18n/                     الترجمات (ar.json / en.json)
```

## الخطوة التالية

اقرأ `DEPLOYMENT.md` للنشر الفعلي على Vercel + ربط الدومين + تفعيل Supabase و
Cloudinary.
