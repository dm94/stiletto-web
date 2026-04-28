import { config } from "@config/config";
import { supportedLanguages } from "@config/languages";
import type { Rarity } from "@ctypes/item";

export const getDomain = () => {
  if (typeof globalThis !== "undefined" && "location" in globalThis) {
    const location = globalThis.location as Location | undefined;
    if (location) {
      return (
        location.protocol.concat("//").concat(location.hostname) +
        (location.port ? `:${location.port}` : "")
      );
    }
  }

  return process.env.NEXT_PUBLIC_URL ?? "";
};

export const getItemCodedName = (itemName: string) =>
  itemName.toLowerCase().replaceAll(" ", "_");

export const getItemDecodedName = (itemName: string) =>
  decodeURI(String(itemName)).replaceAll("_", " ").toLowerCase().trim();

const getValidLangPrefix = (): string => {
  const pathname =
    typeof globalThis !== "undefined" && "location" in globalThis
      ? (globalThis.location as Location | undefined)?.pathname
      : undefined;
  const currentLang = pathname?.split("/").filter(Boolean)[0];
  const supportedLangCodes = supportedLanguages.map((lang) => lang.key);
  return currentLang && supportedLangCodes.includes(currentLang)
    ? `/${currentLang}`
    : "";
};

export const getItemUrl = (itemName: string, rarity?: Rarity) => {
  const langPrefix = getValidLangPrefix();
  const rarityPath = rarity ? `/${rarity}` : "";
  return `${langPrefix}/item/${encodeURI(getItemCodedName(itemName))}${rarityPath}`;
};

export const getCreatureUrl = (creatureName: string) => {
  const langPrefix = getValidLangPrefix();
  return `${langPrefix}/creature/${encodeURI(getItemCodedName(creatureName))}`;
};

export const getItemCraftUrl = (itemName: string) =>
  `${getDomain()}/crafter?craft=${encodeURI(itemName.toLowerCase())}`;

export const getDiscordLoginUrl = () => {
  return `https://discord.com/api/oauth2/authorize?client_id=${
    config.DISCORD_CLIENT_ID
  }&redirect_uri=${getDomain()}/profile&scope=identify%20guilds&response_type=code`;
};

export const toSnakeCase = (str: string) =>
  str
    .toLowerCase()
    .replaceAll(/\s+/g, "_")
    .replaceAll(/[^a-z0-9_]/g, "")
    .replaceAll(/_+/g, "_");

export const toCamelCase = (str: string) =>
  str
    .toLowerCase()
    .replaceAll(/\s+/g, "")
    .replaceAll(/[^a-z0-9]/g, "")
    .replaceAll(/_+/g, "")
    .replaceAll(/(^|_)([a-z])/g, (_, __, letter) => letter.toUpperCase());

export const objectToURLSearchParams = (obj: object): URLSearchParams => {
  const keyValuePairs = Object.keys(obj)
    .filter((key) => obj[key as keyof typeof obj] !== undefined)
    .map(
      (key) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(obj[key as keyof typeof obj])}`,
    );

  return new URLSearchParams(keyValuePairs.join("&"));
};
