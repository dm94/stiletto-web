import { config } from "../config/clientConfig";

export const getDomain = () => {
  // Check if code is running in browser environment
  if (typeof window === "undefined") {
    return "";
  }

  return (
    window?.location?.protocol.concat("//").concat(window?.location?.hostname) +
    (window?.location?.port ? `:${window.location.port}` : "")
  );
};

export const getItemCodedName = (itemName: string) =>
  itemName.toLowerCase().replace(" ", "_");

export const getItemDecodedName = (itemName: string) =>
  decodeURI(String(itemName)).replace("_", " ").toLowerCase();

export const getItemUrl = (itemName: string) =>
  `${getDomain()}/item/${encodeURI(getItemCodedName(itemName))}`;

export const getItemCraftUrl = (itemName: string) =>
  `${getDomain()}/crafter?craft=${encodeURI(itemName.toLowerCase())}`;

export const getDiscordLoginUrl = () => {
  return `https://discord.com/api/oauth2/authorize?client_id=${
    config.DISCORD_CLIENT_ID
  }&redirect_uri=${getDomain()}/profile&scope=identify%20guilds&response_type=code`;
};

export const objectToURLSearchParams = (obj: object): URLSearchParams => {
  const keyValuePairs = Object.keys(obj)
    .filter((key) => obj[key as keyof typeof obj] !== undefined)
    .map(
      (key) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(obj[key as keyof typeof obj])}`,
    );

  return new URLSearchParams(keyValuePairs.join("&"));
};
