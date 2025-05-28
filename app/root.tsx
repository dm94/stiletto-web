import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  LiveReload,
  useLoaderData,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useTranslation } from "react-i18next";

import i18next from "./i18next.server"; // your i18n.server.ts

import "./styles/normalize.css";
import "./styles/style.css";
import "./styles/tribal-ui.css";
import "./styles/desert-theme.css";

export async function loader({ request }: LoaderFunctionArgs) {
  const locale = await i18next.getLocale(request);
  return json(
    { locale },
    { headers: { "Set-Cookie": await i18next.commitSession(request) } },
  );
}

export const handle = {
  // In the handle export, we can add a i18n key with namespaces our route
  // will need to load. This key can be a single string or an array of strings.
  // TIP: In most cases, you should set this to your default namespace
  // or if you did not set one, set it to the i18next default namespace "translation"
  i18n: "translation",
};

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
];

export default function App() {
  // Get the locale from the loader
  const { locale } = useLoaderData<typeof loader>();
  const { i18n } = useTranslation();

  // This hook will change the i18n instance language to the current locale
  // detected by the loader during SSR.
  // On the client, it will update the lang attribute on the html tag and persist
  // the language in the session, so that the language persists when the user
  // navigates to another route.

  return (
    <html lang={locale} dir={i18n.dir()}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Stiletto for Last Oasis" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://stiletto.deeme.dev/" />
        <meta
          property="og:image"
          content="https://stiletto.deeme.dev/thumb.jpg"
        />
        <meta property="og:site_name" content="Stiletto" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:locale:alternate" content="fr_FR" />
        <meta property="og:locale:alternate" content="es_ES" />
        <meta property="og:locale:alternate" content="zh_CN" />
        <meta property="og:locale:alternate" content="de_DE" />
        <meta property="og:locale:alternate" content="it_IT" />
        <meta property="og:locale:alternate" content="ja" />
        <meta property="og:locale:alternate" content="pl" />
        <meta property="og:locale:alternate" content="pt_BR" />
        <meta property="og:locale:alternate" content="ru" />
        <meta
          property="og:description"
          content="Web Utilities for Last Oasis Game. Materials calculator, Interactive maps, Trades, Wiki, Clans and much more"
        />
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
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
