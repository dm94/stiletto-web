import { type NextRequest, NextResponse } from "next/server";

const PUBLIC_FILE = /\.(.*)$/;

// Match all paths except those starting with:
// - /_next (Next.js internals)
// - /api (API routes)
// - /static (static files)
// - files with extensions (public files)
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)"],
};

export async function middleware(req: NextRequest) {
  // Skip middleware for public files, Next.js internals, and API routes
  if (
    req.nextUrl.pathname.startsWith("/_next") ||
    req.nextUrl.pathname.includes("/api/") ||
    PUBLIC_FILE.test(req.nextUrl.pathname)
  ) {
    return;
  }

  // Get the preferred locale from cookies or default to 'en'
  const locale = req.cookies.get("NEXT_LOCALE")?.value || "en";

  // Check if URL doesn't already have a locale prefix
  const pathname = req.nextUrl.pathname;

  // Get all supported locales from next.config.mjs
  const supportedLocales = [
    "en",
    "es",
    "ru",
    "fr",
    "de",
    "it",
    "ja",
    "pl",
    "zh",
    "ca",
    "pt",
  ];

  // Check if pathname already has a locale prefix
  const pathnameHasLocale = supportedLocales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  // If pathname doesn't have locale prefix, redirect to add the locale
  if (!pathnameHasLocale) {
    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname === "/" ? "" : pathname}${req.nextUrl.search}`,
        req.url,
      ),
    );
  }
}
