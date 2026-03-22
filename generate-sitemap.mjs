import { existsSync } from "node:fs";
import { readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.join(__dirname, "public");
const ITEMS_MIN_PATH = path.join(PUBLIC_DIR, "json", "items_min.json");
const CREATURES_MIN_PATH = path.join(PUBLIC_DIR, "json", "creatures_min.json");
const SITEMAP_PATH = path.join(PUBLIC_DIR, "sitemap.xml");

const STATIC_ROUTES = [
  "",
  "profile",
  "crafter",
  "members",
  "clan/walkers",
  "clanlist",
  "maps",
  "trades",
  "diplomacy",
  "auctions",
  "others",
  "map",
  "tech",
  "tech/Vitamins",
  "tech/Equipment",
  "tech/Crafting",
  "tech/Construction",
  "tech/Walkers",
  "privacy",
  "wiki",
  "perks",
  "item",
  "creature",
];

const toCodedName = (name) => name.toLowerCase().replaceAll(" ", "_");
const SUPPORTED_LANGUAGES = [
  "en",
  "es",
  "ru",
  "fr",
  "de",
  "it",
  "ja",
  "pl",
  "zh",
  "pt",
  "uk",
];


const toItemPath = (name) => `item/${encodeURI(toCodedName(name))}`;
const toCreaturePath = (name) => `creature/${encodeURI(toCodedName(name))}`;
const trimSlash = (value) => value.replace(/\/+$/, "");


const escapeXml = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

const getDomainFromExistingSitemap = async () => {
  if (!existsSync(SITEMAP_PATH)) {
    return undefined;
  }

  const sitemapContent = await readFile(SITEMAP_PATH, "utf8");
  const matchedLoc = sitemapContent.match(/<loc>(.*?)<\/loc>/);

  if (matchedLoc?.[1] == null) {
    return undefined;
  }

  try {
    return new URL(matchedLoc[1]).origin;
  } catch {
    return undefined;
  }
};

const resolveBaseUrl = async () => {
  const envBaseUrl = process.env.PUBLIC_SITE_URL ?? process.env.VITE_PUBLIC_URL;
  if (envBaseUrl != null && envBaseUrl.trim() !== "") {
    return trimSlash(envBaseUrl.trim());
  }

  const existingSitemapDomain = await getDomainFromExistingSitemap();
  if (existingSitemapDomain != null) {
    return trimSlash(existingSitemapDomain);
  }

  return "https://stiletto.deeme.dev";
};

const getLastModifiedDate = async () => {
  const stats = await Promise.all([stat(ITEMS_MIN_PATH), stat(CREATURES_MIN_PATH)]);
  let latestMtime = 0;

  for (const fileStat of stats) {
    if (fileStat.mtimeMs > latestMtime) {
      latestMtime = fileStat.mtimeMs;
    }
  }

  return new Date(latestMtime).toISOString().slice(0, 10);
};

const buildRouteUrl = (baseUrl, routePath) => {
  if (routePath === "") {
    return `${baseUrl}/`;
  }

  return `${baseUrl}/${routePath}`;
};

const buildLocalizedRoutePath = (routePath, languageCode) => {
  if (routePath === "") {
    return languageCode;
  }

  return `${languageCode}/${routePath}`;
};

const buildAlternateLinks = (baseUrl, routePath) => {
  const canonicalUrl = buildRouteUrl(baseUrl, routePath);

  const alternates = [
    {
      hreflang: "x-default",
      href: canonicalUrl,
    },
  ];

  for (const languageCode of SUPPORTED_LANGUAGES) {
    alternates.push({
      hreflang: languageCode,
      href: buildRouteUrl(
        baseUrl,
        buildLocalizedRoutePath(routePath, languageCode),
      ),
    });
  }

  return alternates;
};

const toUrlNode = (url, lastmod, changefreq, priority, alternates) => {
  const safeUrl = escapeXml(url);
  const alternateNodes = alternates.map((alternate) => {
    const safeHref = escapeXml(alternate.href);
    return `    <xhtml:link rel="alternate" hreflang="${alternate.hreflang}" href="${safeHref}" />`;
  });

  return [
    "  <url>",
    `    <loc>${safeUrl}</loc>`,
    ...alternateNodes,
    `    <lastmod>${lastmod}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority.toFixed(1)}</priority>`,
    "  </url>",
  ].join("\n");
};

const buildSitemap = (urls) =>
  [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...urls,
    "</urlset>",
    "",
  ].join("\n");

const run = async () => {
  const [itemsRaw, creaturesRaw, baseUrl, lastmod] = await Promise.all([
    readFile(ITEMS_MIN_PATH, "utf8"),
    readFile(CREATURES_MIN_PATH, "utf8"),
    resolveBaseUrl(),
    getLastModifiedDate(),
  ]);

  const items = JSON.parse(itemsRaw);
  const creatures = JSON.parse(creaturesRaw);

  const routeMap = new Map();

  for (const route of STATIC_ROUTES) {
    const fullUrl = buildRouteUrl(baseUrl, route);
    routeMap.set(fullUrl, {
      changefreq: route === "" ? "daily" : "weekly",
      priority: route === "" ? 1.0 : 0.8,
      routePath: route,
    });
  }

  for (const item of items) {
    const name = item?.name;
    if (typeof name !== "string" || name.trim() === "") {
      continue;
    }

    const itemRoutePath = toItemPath(name);
    const itemUrl = buildRouteUrl(baseUrl, itemRoutePath);
    routeMap.set(itemUrl, {
      changefreq: "weekly",
      priority: 0.6,
      routePath: itemRoutePath,
    });
  }

  for (const creature of creatures) {
    const name = creature?.name;
    if (typeof name !== "string" || name.trim() === "") {
      continue;
    }

    const creatureRoutePath = toCreaturePath(name);
    const creatureUrl = buildRouteUrl(baseUrl, creatureRoutePath);
    routeMap.set(creatureUrl, {
      changefreq: "weekly",
      priority: 0.6,
      routePath: creatureRoutePath,
    });
  }

  const orderedEntries = [...routeMap.entries()].sort((left, right) =>
    left[0].localeCompare(right[0]),
  );

  const urlNodes = [];
  for (const [url, metadata] of orderedEntries) {
    urlNodes.push(
      toUrlNode(
        url,
        lastmod,
        metadata.changefreq,
        metadata.priority,
        buildAlternateLinks(baseUrl, metadata.routePath),
      ),
    );
  }

  const sitemapXml = buildSitemap(urlNodes);
  await writeFile(SITEMAP_PATH, sitemapXml, "utf8");

  console.info(
    `Generated sitemap with ${urlNodes.length} urls at ${path.relative(__dirname, SITEMAP_PATH)}`,
  );
};

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
