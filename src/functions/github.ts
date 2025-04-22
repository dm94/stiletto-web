import type { Marker } from "@ctypes/dto/marker";
import { addCachedData, getCachedData } from "./services";
import type { Item } from "@ctypes/item";
import type { MapJsonInfo } from "@ctypes/dto/maps";

const resourceCacheTimeCheck = 86400000;

export const getMarkers = async (): Promise<Marker[] | undefined> => {
  const cachedData = getCachedData("markers", resourceCacheTimeCheck);

  if (cachedData != null) {
    return cachedData;
  }

  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/dm94/stiletto-web/master/public/json/markers.min.json",
      {
        method: "GET",
      },
    );

    const data = await response.json();

    addCachedData("markers", data);

    return data;
  } catch {
    throw new Error("errors.apiConnection");
  }
};

export const getItems = async (): Promise<Item[]> => {
  const cachedData = getCachedData("allItems", resourceCacheTimeCheck);

  if (cachedData != null) {
    return cachedData;
  }

  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/dm94/stiletto-web/master/public/json/items_min.json",
      {
        method: "GET",
      },
    );

    const data = await response.json();

    addCachedData("allItems", data);

    return data;
  } catch {
    throw new Error("errors.apiConnection");
  }
};

export const getMapNames = async (): Promise<MapJsonInfo[]> => {
  const cachedData = getCachedData("maps", resourceCacheTimeCheck);

  if (cachedData != null) {
    return cachedData as MapJsonInfo[];
  }

  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/dm94/stiletto-web/master/public/json/maps.min.json",
      {
        method: "GET",
      },
    );

    const data = await response.json();

    addCachedData("maps", data);

    return data;
  } catch {
    throw new Error("errors.apiConnection");
  }
};
