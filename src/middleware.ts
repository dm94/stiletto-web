import { NextRequest, NextResponse } from "next/server";
import { supportedLanguages } from "./config/languages";

const DEFAULT_LANG = "en";
const languageSet = new Set(supportedLanguages.map((l) => l.key));

function detectFromHeader(value: string | null) {
  if (!value) return null;

  const candidates = value
    .split(",")
    .map((part) => part.trim().split(";")[0]?.toLowerCase())
    .filter(Boolean) as string[];

  for (const c of candidates) {
    if (languageSet.has(c)) return c;
    const base = c.split("-")[0];
    if (base && languageSet.has(base)) return base;
  }

  return null;
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];

  if (first && languageSet.has(first)) {
    const restSegments = segments.slice(1);

    if (
      restSegments[0] === "wiki" ||
      restSegments[0] === "item" ||
      restSegments[0] === "creature"
    ) {
      return NextResponse.next();
    }

    const url = req.nextUrl.clone();
    url.pathname = `/${restSegments.join("/")}`;
    url.search = search;
    return NextResponse.rewrite(url);
  }

  const headerLang = detectFromHeader(req.headers.get("accept-language"));
  const lang = headerLang ?? DEFAULT_LANG;

  const url = req.nextUrl.clone();
  url.pathname = `/${lang}${pathname}`;
  url.search = search;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
