import { existsSync } from "node:fs";
import { readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.join(__dirname, "public");
const ITEMS_MIN_PATH = path.join(PUBLIC_DIR, "json", "items_min.json");
const CREATURES_MIN_PATH = path.join(PUBLIC_DIR, "json", "creatures_min.json");
const SITEMAP_INDEX_FILENAME = "sitemap.xml";
const SITEMAP_STATIC_FILENAME = "sitemap-static.xml";
const SITEMAP_ITEMS_FILENAME = "sitemap-items.xml";
const SITEMAP_CREATURES_FILENAME = "sitemap-creatures.xml";
const SITEMAP_INDEX_PATH = path.join(PUBLIC_DIR, SITEMAP_INDEX_FILENAME);
const SITEMAP_STATIC_PATH = path.join(PUBLIC_DIR, SITEMAP_STATIC_FILENAME);
const SITEMAP_ITEMS_PATH = path.join(PUBLIC_DIR, SITEMAP_ITEMS_FILENAME);
const SITEMAP_CREATURES_PATH = path.join(PUBLIC_DIR, SITEMAP_CREATURES_FILENAME);

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

const toSlug = (name) =>
  name
    .toLowerCase()
    .replaceAll(" ", "-")
    .replaceAll(":", "")
    .replaceAll("/", "")
    .replaceAll("\\", "")
    .replaceAll("?", "")
    .replaceAll("*", "");

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

const toItemPath = (name) => `item/${toSlug(name)}`;
const toCreaturePath = (name) => `creature/${toSlug(name)}`;
const trimSlash = (value) => value.replace(/\/+$/, "");

const escapeXml = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

const getDomainFromExistingSitemap = async () => {
  if (!existsSync(SITEMAP_INDEX_PATH)) {
    return undefined;
  }

  const sitemapContent = await readFile(SITEMAP_INDEX_PATH, "utf8");
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

const toSitemapIndexNode = (loc, lastmod) => {
  const safeLoc = escapeXml(loc);

  return [
    "  <sitemap>",
    `    <loc>${safeLoc}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    "  </sitemap>",
  ].join("\n");
};

const buildSitemapIndex = (sitemaps) =>
  [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...sitemaps,
    "</sitemapindex>",
    "",
  ].join("\n");

const createRouteEntry = (baseUrl, routePath, changefreq, priority) => ({
  url: buildRouteUrl(baseUrl, routePath),
  routePath,
  changefreq,
  priority,
});

const sortByUrl = (entries) =>
  entries.sort((left, right) => left.url.localeCompare(right.url));

const buildStaticRouteEntries = (baseUrl) => {
  const routeMap = new Map();

  for (const route of STATIC_ROUTES) {
    routeMap.set(
      buildRouteUrl(baseUrl, route),
      createRouteEntry(
        baseUrl,
        route,
        route === "" ? "daily" : "weekly",
        route === "" ? 1.0 : 0.8,
      ),
    );
  }

  return sortByUrl([...routeMap.values()]);
};

const buildEntityRouteEntries = (baseUrl, entities, toRoutePath) => {
  const routeMap = new Map();

  for (const entity of entities) {
    const name = entity?.name;
    if (typeof name !== "string" || name.trim() === "") {
      continue;
    }

    const routePath = toRoutePath(name);
    routeMap.set(
      buildRouteUrl(baseUrl, routePath),
      createRouteEntry(baseUrl, routePath, "weekly", 0.6),
    );
  }

  return sortByUrl([...routeMap.values()]);
};

const buildSitemapFromEntries = (baseUrl, entries, lastmod) => {
  const urlNodes = [];

  for (const entry of entries) {
    urlNodes.push(
      toUrlNode(
        entry.url,
        lastmod,
        entry.changefreq,
        entry.priority,
        buildAlternateLinks(baseUrl, entry.routePath),
      ),
    );
  }

  return buildSitemap(urlNodes);
};

const run = async () => {
  const [itemsRaw, creaturesRaw, baseUrl, lastmod] = await Promise.all([
    readFile(ITEMS_MIN_PATH, "utf8"),
    readFile(CREATURES_MIN_PATH, "utf8"),
    resolveBaseUrl(),
    getLastModifiedDate(),
  ]);

  const parsedItems = JSON.parse(itemsRaw);
  const parsedCreatures = JSON.parse(creaturesRaw);
  const items = Array.isArray(parsedItems) ? parsedItems : [];
  const creatures = Array.isArray(parsedCreatures) ? parsedCreatures : [];

  const staticEntries = buildStaticRouteEntries(baseUrl);
  const itemEntries = buildEntityRouteEntries(baseUrl, items, toItemPath);
  const creatureEntries = buildEntityRouteEntries(
    baseUrl,
    creatures,
    toCreaturePath,
  );

  await Promise.all([
    writeFile(
      SITEMAP_STATIC_PATH,
      buildSitemapFromEntries(baseUrl, staticEntries, lastmod),
      "utf8",
    ),
    writeFile(
      SITEMAP_ITEMS_PATH,
      buildSitemapFromEntries(baseUrl, itemEntries, lastmod),
      "utf8",
    ),
    writeFile(
      SITEMAP_CREATURES_PATH,
      buildSitemapFromEntries(baseUrl, creatureEntries, lastmod),
      "utf8",
    ),
  ]);

  const sitemapIndex = buildSitemapIndex([
    toSitemapIndexNode(buildRouteUrl(baseUrl, SITEMAP_STATIC_FILENAME), lastmod),
    toSitemapIndexNode(buildRouteUrl(baseUrl, SITEMAP_ITEMS_FILENAME), lastmod),
    toSitemapIndexNode(
      buildRouteUrl(baseUrl, SITEMAP_CREATURES_FILENAME),
      lastmod,
    ),
  ]);

  await writeFile(SITEMAP_INDEX_PATH, sitemapIndex, "utf8");

  console.info(
    `Generated sitemap index at ${path.relative(__dirname, SITEMAP_INDEX_PATH)}`,
  );
  console.info(
    `Generated ${staticEntries.length} static urls at ${path.relative(__dirname, SITEMAP_STATIC_PATH)}`,
  );
  console.info(
    `Generated ${itemEntries.length} item urls at ${path.relative(__dirname, SITEMAP_ITEMS_PATH)}`,
  );
  console.info(
    `Generated ${creatureEntries.length} creature urls at ${path.relative(__dirname, SITEMAP_CREATURES_PATH)}`,
  );
};

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
