import type { Marker } from "@ctypes/dto/marker";
import { addCachedData, getCachedData } from "./services";
import type { Item, TechItem } from "@ctypes/item";
import type { MapJsonInfo } from "@ctypes/dto/maps";

const RESOURCE_CACHE_TIME_CHECK = import.meta.env.PROD ? 86400000 : 1;
const REPO_JSON_URL = import.meta.env.PROD
  ? "https://raw.githubusercontent.com/dm94/stiletto-web/master/public/json"
  : "/json";

const fetchResource = async <T>(
  cacheKey: string,
  filename: string,
  useCache = true,
): Promise<T> => {
  if (useCache) {
    const cachedData = getCachedData(cacheKey, RESOURCE_CACHE_TIME_CHECK);
    if (cachedData != null) {
      return cachedData;
    }
  }

  try {
    const response = await fetch(`${REPO_JSON_URL}/${filename}`, {
      method: "GET",
    });
    const data = await response.json();
    if (useCache) {
      addCachedData(cacheKey, data);
    }
    return data;
  } catch {
    throw new Error("errors.apiConnection");
  }
};

export const getMarkers = (): Promise<Marker[]> =>
  fetchResource<Marker[]>("markers", "markers.min.json");

export const getItems = (): Promise<Item[]> =>
  fetchResource<Item[]>("allItems", "items_min.json");

export const getMapNames = (): Promise<MapJsonInfo[]> =>
  fetchResource<MapJsonInfo[]>("maps", "maps.min.json");

export const getTechItems = (): Promise<TechItem[]> =>
  fetchResource<TechItem[]>("techItems", "tech_min.json", false);
