import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// List of all supported locales
const locales = [
  "en",
  "fr",
  "es",
  "zh",
  "de",
  "it",
  "ja",
  "pl",
  "pt",
  "ru",
  "uk",
  "ca",
  "tr",
];
const defaultLocale = "en";

// Get the preferred locale from request headers
function getLocale(request: NextRequest) {
  // Check if there is a cookie with a preferred locale
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookieLocale && locales.includes(cookieLocale)) {
    return cookieLocale;
  }

  // Check Accept-Language header
  const acceptLanguage = request.headers.get("accept-language");
  if (acceptLanguage) {
    const parsedLocales = acceptLanguage.split(",").map((l) => {
      const [locale, priority] = l.split(";q=");
      return {
        locale: locale.trim().split("-")[0],
        priority: priority ? Number(priority) : 1,
      };
    });

    // Sort by priority (highest first)
    parsedLocales.sort((a, b) => b.priority - a.priority);

    // Find the first locale that is supported
    const matchedLocale = parsedLocales.find((l) =>
      locales.includes(l.locale),
    )?.locale;
    if (matchedLocale) {
      return matchedLocale;
    }
  }

  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip for assets, api routes, etc.
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/img") ||
    pathname.startsWith("/json") ||
    pathname.includes(".") // Skip files with extensions
  ) {
    return NextResponse.next();
  }

  // Check if the pathname already includes a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Redirect to the locale-prefixed path
  const locale = getLocale(request);
  const newUrl = new URL(
    `/${locale}${pathname === "/" ? "" : pathname}`,
    request.url,
  );

  // Preserve query parameters
  request.nextUrl.searchParams.forEach((value, key) => {
    newUrl.searchParams.set(key, value);
  });

  return NextResponse.redirect(newUrl);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
