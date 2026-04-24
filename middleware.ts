import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { supportedLanguages } from './src/config/languages';

const locales = supportedLanguages.map(l => l.key);
const defaultLocale = 'en';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // Redirect if there is no locale
  const locale = defaultLocale;
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, assets, ...)
    '/((?!api|_next/static|_next/image|favicon.ico|json|locales|images|icons|styles|fonts).*)',
  ],
};
