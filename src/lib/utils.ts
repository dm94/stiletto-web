import { getStoredItem } from "./storage";
import { config } from "@/config/config";

export const getDomain = () =>
  window.location.protocol.concat("//").concat(window.location.hostname) +
  (window.location.port ? `:${window.location.port}` : "");

export const getItemUrl = (item: string) =>
  `/item/${encodeURI(item.toLowerCase().replaceAll(" ", "_"))}`;

export const getItemCraftUrl = (itemName: string) =>
  `/crafter?craft=${encodeURI(itemName.toLowerCase())}`;

export const isDarkMode = () => {
  const darkMode = getStoredItem("darkmode");
  if (darkMode !== null && darkMode === "true") {
    return true;
  }

  return (
    window &&
    window?.document?.documentElement?.getAttribute("data-theme") === "dark"
  );
};

export const getDiscordLoginUrl = () => {
  return `https://discord.com/api/oauth2/authorize?client_id=${
    config.DISCORD_CLIENT_ID
  }&redirect_uri=${getDomain()}/profile&scope=identify%20guilds&response_type=code`;
};

export function formatNumber(value: number): string {
  return new Intl.NumberFormat().format(value);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
