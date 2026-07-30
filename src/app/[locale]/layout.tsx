import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, Tajawal } from "next/font/google";
import "../globals.css";
import { locales, localeMeta, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import ThemeProvider from "@/components/ThemeProvider";
import SplashScreen from "@/components/SplashScreen";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RegisterSW from "@/components/RegisterSW";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const tajawal = Tajawal({
  subsets: ["arabic"],
  variable: "--font-arabic",
  weight: ["400", "500", "700"],
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale = locale as Locale;

  const dict = await getDictionary(currentLocale);
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${dict.brand.name} — ${dict.brand.tagline}`,
      template: `%s — CONSUL`,
    },
    description: dict.hero.subtitle,
    manifest: "/manifest.json",
    icons: {
      icon: [
        {
          url: "/icons/favicon-32.png",
          sizes: "32x32",
          type: "image/png",
        },
      ],
      apple: [
        {
          url: "/icons/apple-touch-icon.png",
          sizes: "180x180",
          type: "image/png",
        },
      ],
    },
    alternates: {
      canonical: `/${currentLocale}`,
      languages: {
        ar: "/ar",
        en: "/en",
      },
    },
    openGraph: {
      title: dict.brand.name,
      description: dict.hero.subtitle,
      locale: currentLocale === "ar" ? "ar_SA" : "en_US",
      type: "website",
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#0a0a09",
  width: "device-width",
  initialScale: 1,
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const currentLocale = locale as Locale;

  const dict = await getDictionary(currentLocale);
  const dir = localeMeta[currentLocale].dir;

  return (
    <html
      lang={currentLocale}
      dir={dir}
      suppressHydrationWarning
    >
      <body
        className={`${fraunces.variable} ${inter.variable} ${tajawal.variable}`}
      >
        <ThemeProvider>
          <RegisterSW />
          <SplashScreen />
          <Navbar locale={currentLocale} dict={dict} />
          <main className="pt-16">{children}</main>
          <Footer locale={currentLocale} dict={dict} />
        </ThemeProvider>
      </body>
    </html>
  );
}