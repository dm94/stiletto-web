import type { Marker } from "@ctypes/dto/marker";
import { addCachedData, getCachedData } from "./services";
import type { Item, ItemCompleteInfo, TechItem } from "@ctypes/item";
import type { MapJsonInfo } from "@ctypes/dto/maps";
import { toSnakeCase } from "./utils";
import type { Creature, CreatureCompleteInfo } from "@ctypes/creature";

const RESOURCE_CACHE_TIME_CHECK = import.meta.env.PROD ? 86400000 : 1;
const REPO_URL = "https://raw.githubusercontent.com/dm94/stiletto-web/master";
const REPO_JSON_URL = import.meta.env.PROD
  ? `${REPO_URL}/public/json`
  : "/json";

const WIKI_MD_URL = `${REPO_URL}/wiki`;

const fetchResource = async <T>(
  filePath: string,
  cacheKey?: string,
): Promise<T> => {
  if (cacheKey) {
    const cachedData = getCachedData(cacheKey, RESOURCE_CACHE_TIME_CHECK);
    if (cachedData != null) {
      return cachedData;
    }
  }

  try {
    const response = await fetch(`${REPO_JSON_URL}${filePath}`, {
      method: "GET",
    });
    const data = await response.json();
    if (cacheKey) {
      addCachedData(cacheKey, data);
    }
    return data;
  } catch {
    throw new Error("errors.apiConnection");
  }
};

export const getMarkers = (): Promise<Marker[]> =>
  fetchResource<Marker[]>("/markers.min.json", "markers");

export const getItems = (): Promise<Item[]> =>
  fetchResource<Item[]>("/items_min.json", "allItems");

export const getMapNames = (): Promise<MapJsonInfo[]> =>
  fetchResource<MapJsonInfo[]>("/maps.min.json", "maps");

export const getTechItems = (): Promise<TechItem[]> =>
  fetchResource<TechItem[]>("/tech_min.json");

export const getItemInfo = (itemName: string): Promise<ItemCompleteInfo> =>
  fetchResource<ItemCompleteInfo>(`/items/${toSnakeCase(itemName)}.json`);

export const getCreatures = (): Promise<Creature[]> =>
  fetchResource<Creature[]>("/creatures_min.json");

export const getCreatureInfo = (
  creatureName: string,
): Promise<CreatureCompleteInfo> =>
  fetchResource<CreatureCompleteInfo>(
    `/creatures/${toSnakeCase(creatureName)}.json`,
  );

export const getMDContent = async (
  type: "items" | "creatures",
  name: string,
): Promise<string> => {
  try {
    const response = await fetch(`${WIKI_MD_URL}/${type}/${name}.md`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("errors.pageNotFound");
    }

    return await response.text();
  } catch {
    throw new Error("errors.apiConnection");
  }
};
