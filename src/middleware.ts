import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale, isLocale } from "@/i18n/config";

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameHasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
  if (pathnameHasLocale) return NextResponse.next();

  // Detect preferred locale from cookie, then Accept-Language, then default
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  let locale = defaultLocale;

  if (cookieLocale && isLocale(cookieLocale)) {
    locale = cookieLocale;
  } else {
    const header = request.headers.get("accept-language") ?? "";
    const preferred = header.split(",")[0]?.split("-")[0];
    if (preferred && isLocale(preferred)) locale = preferred;
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}
