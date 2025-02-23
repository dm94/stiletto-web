import { getStoredItem } from "./services";
import { config } from "../config/config";

export const getDomain = () =>
  window.location.protocol.concat("//").concat(window.location.hostname) +
  (window.location.port ? `:${window.location.port}` : "");

export const getItemUrl = (item) =>
  `${getDomain()}/item/${encodeURI(item.toLowerCase().replaceAll(" ", "_"))}`;

export const getItemCraftUrl = (itemName) =>
  `${getDomain()}/crafter?craft=${encodeURI(itemName.toLowerCase())}`;

export const isDarkMode = () => {
  const darkMode = getStoredItem("darkmode");
  if (darkMode !== null && darkMode === "true") {
    return true;
  }

  return document?.documentElement?.attributes?.["data-theme"]?.value === "dark";
};

export const getDiscordLoginUrl = () => {
  return `https://discord.com/api/oauth2/authorize?client_id=${config.REACT_APP_DISCORD_CLIENT_ID
    }&redirect_uri=${getDomain()}/profile&scope=identify%20guilds&response_type=code`;
};
