import type { ReactNode } from "react";
import type { Metadata } from "next";
import { locales } from "../../lib/i18n";

// Generate static params for all supported locales
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// Define the params type for the layout
type LocaleLayoutProps = {
  children: ReactNode;
  params: {
    locale: string;
  };
};

export async function generateMetadata({
  params,
}: { params: { locale: string } }): Promise<Metadata> {
  const locale = params.locale;

  return {
    title: "Stiletto for Last Oasis",
    description:
      "Web Utilities for Last Oasis Game. Materials calculator, Interactive maps, Trades, Wiki, Clans and much more",
    openGraph: {
      title: "Stiletto for Last Oasis",
      type: "website",
      url: "https://stiletto.deeme.dev/",
      images: [
        {
          url: "https://stiletto.deeme.dev/thumb.jpg",
          width: 192,
          height: 192,
          alt: "Stiletto for Last Oasis",
        },
      ],
      siteName: "Stiletto",
      locale: locale,
      alternateLocale: [
        "en_US",
        "fr_FR",
        "es_ES",
        "zh_CN",
        "de_DE",
        "it_IT",
        "ja",
        "pl",
        "pt_BR",
        "ru",
      ],
      description:
        "Web Utilities for Last Oasis Game. Materials calculator, Interactive maps, Trades, Wiki, Clans and much more",
    },
    authors: [
      {
        name: "Dm94Dani",
      },
    ],
    keywords: "Last Oasis, utilities, game, crafting, map",
    twitter: {
      card: "summary_large_image",
      title: "Stiletto for Last Oasis",
      creator: "@dm94dani",
    },
  };
}

export default function LocaleLayout({
  children,
  params: { locale },
}: LocaleLayoutProps) {
  return (
    <html lang={locale}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="flex flex-col h-full">
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <script
          src="https://kit.fontawesome.com/bba734017e.js"
          crossOrigin="anonymous"
        />
        <div className="flex flex-col h-full" id="root">
          {children}
        </div>
      </body>
    </html>
  );
}
