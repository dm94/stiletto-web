import { config } from "@config/config";

export const getDomain = () =>
  window.location.protocol.concat("//").concat(window.location.hostname) +
  (window.location.port ? `:${window.location.port}` : "");

export const getItemCodedName = (itemName: string) =>
  itemName.toLowerCase().replaceAll(" ", "_");

export const getItemDecodedName = (itemName: string) =>
  decodeURI(String(itemName)).replaceAll("_", " ").toLowerCase().trim();

export const getItemUrl = (itemName: string) =>
  `${getDomain()}/item/${encodeURI(getItemCodedName(itemName))}`;

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
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "")
    .replace(/_+/g, "_");

export const objectToURLSearchParams = (obj: object): URLSearchParams => {
  const keyValuePairs = Object.keys(obj)
    .filter((key) => obj[key as keyof typeof obj] !== undefined)
    .map(
      (key) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(obj[key as keyof typeof obj])}`,
    );

  return new URLSearchParams(keyValuePairs.join("&"));
};
