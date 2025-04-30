import "../styles/normalize.css";
import "../styles/style.css";
import "../styles/tribal-ui.css";
import "../styles/desert-theme.css";
import type { ReactNode } from "react";

export const metadata = {
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
        width: 1200,
        height: 630,
        alt: "Stiletto for Last Oasis",
      },
    ],
    siteName: "Stiletto",
    locale: "en_US",
    alternateLocales: [
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
  twitter: {
    creator: "@dm94dani",
  },
  keywords: ["Last Oasis", "utilities", "game", "crafting", "map"],
  authors: [{ name: "Dm94Dani" }],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Open Graph and other meta tags are handled by metadata above */}
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
        <script
          src="https://kit.fontawesome.com/bba734017e.js"
          crossOrigin="anonymous"
        />
      </head>
      <body className="flex flex-col h-full">
        {children}
        <noscript>You need to enable JavaScript to run this app.</noscript>
      </body>
    </html>
  );
}
