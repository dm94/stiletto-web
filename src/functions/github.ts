import type { Marker } from "@ctypes/dto/marker";
import { addCachedData, getCachedData } from "./services";
import type { Item, TechItem } from "@ctypes/item";
import type { MapJsonInfo } from "@ctypes/dto/maps";

const RESOURCE_CACHE_TIME_CHECK = import.meta.env.PROD ? 86400000 : 1;
const REPO_JSON_URL = import.meta.env.PROD
  ? "https://raw.githubusercontent.com/dm94/stiletto-web/master/public/json"
  : "/json";

export const getMarkers = async (): Promise<Marker[] | undefined> => {
  const cachedData = getCachedData("markers", RESOURCE_CACHE_TIME_CHECK);

  if (cachedData != null) {
    return cachedData;
  }

  try {
    const response = await fetch(`${REPO_JSON_URL}/markers.min.json`, {
      method: "GET",
    });

    const data = await response.json();

    addCachedData("markers", data);

    return data;
  } catch {
    throw new Error("errors.apiConnection");
  }
};

export const getItems = async (): Promise<Item[]> => {
  const cachedData = getCachedData("allItems", RESOURCE_CACHE_TIME_CHECK);

  if (cachedData != null) {
    return cachedData;
  }

  try {
    const response = await fetch(`${REPO_JSON_URL}/items_min.json`, {
      method: "GET",
    });

    const data = await response.json();

    addCachedData("allItems", data);

    return data;
  } catch {
    throw new Error("errors.apiConnection");
  }
};

export const getMapNames = async (): Promise<MapJsonInfo[]> => {
  const cachedData = getCachedData("maps", RESOURCE_CACHE_TIME_CHECK);

  if (cachedData != null) {
    return cachedData as MapJsonInfo[];
  }

  try {
    const response = await fetch(`${REPO_JSON_URL}/maps.min.json`, {
      method: "GET",
    });

    const data = await response.json();

    addCachedData("maps", data);

    return data;
  } catch {
    throw new Error("errors.apiConnection");
  }
};

export const getTechItems = async (): Promise<TechItem[]> => {
  try {
    const response = await fetch(`${REPO_JSON_URL}/tech_min.json`, {
      method: "GET",
    });

    return await response.json();

  } catch {
    throw new Error("errors.apiConnection");
  }
};
