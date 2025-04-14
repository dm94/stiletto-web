import type { MapJsonInfo } from "../types/dto/maps";
import type { Marker } from "../types/dto/marker";
import type { Item } from "../types/item";

const timeCheck = 300000;
const resourceCacheTimeCheck = 86400000;

export const getStoredItem = (name: string) => {
  if (name == null) {
    return null;
  }

  // Check if code is running in browser environment
  if (typeof window === "undefined") {
    return null;
  }

  let data = localStorage.getItem(name);

  if (data == null) {
    data = sessionStorage.getItem(name);
    if (data != null && localStorage.getItem("acceptscookies")) {
      storeItem(name, data);
    }
  }

  return data;
};

export const storeItem = (name: string, data: string) => {
  if (name == null || data == null) {
    return;
  }

  // Check if code is running in browser environment
  if (typeof window === "undefined") {
    return;
  }

  if (getStoredItem("acceptscookies")) {
    localStorage.setItem(name, data);
  } else {
    sessionStorage.setItem(name, data);
  }
};

export const getCachedData = (name: string, time = timeCheck) => {
  if (name == null) {
    return null;
  }

  const data = getStoredItem(name);
  const lastDataCheck = getStoredItem(`${name}-lastCheck`);

  if (
    data != null &&
    lastDataCheck != null &&
    Number(lastDataCheck) >= Date.now() - time
  ) {
    return JSON.parse(data);
  }
  return null;
};

export const addCachedData = (name: string, data: unknown) => {
  if (name == null || data == null) {
    return;
  }

  storeItem(name, JSON.stringify(data));
  storeItem(`${name}-lastCheck`, String(Date.now()));
};

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

export const closeSession = () => {
  // Check if code is running in browser environment
  if (typeof window === "undefined") {
    return;
  }

  localStorage.clear();
  sessionStorage.clear();
  window.location.reload();
};
