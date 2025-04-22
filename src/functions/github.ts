import type { Marker } from "@ctypes/dto/marker";
import { addCachedData, getCachedData } from "./services";
import type { Item } from "@ctypes/item";
import type { MapJsonInfo } from "@ctypes/dto/maps";

const RESOURCE_CACHE_TIME_CHECK = 86400000;
const REPO_JSON_URL =
  "https://raw.githubusercontent.com/dm94/stiletto-web/master/public/json";

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
