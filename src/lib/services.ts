import type { MapData, Marker } from "@/types/maps";
import { config } from "@/config/config";
import { Item } from "@/types/items";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.stiletto.live";

export async function getMapNames(): Promise<MapData[]> {
  try {
    const response = await fetch(`${API_URL}/maps/names`);
    if (!response.ok) {
      throw new Error("Failed to fetch map names");
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching map names:", error);
    return [];
  }
}

export async function getMarkers(): Promise<Marker[]> {
  try {
    const response = await fetch(`${API_URL}/markers`);
    if (!response.ok) {
      throw new Error("Failed to fetch markers");
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching markers:", error);
    return [];
  }
}

export const getItems = async (): Promise<Item[]> => {
  try {
    const response = await fetch(`${config.API_URL}/items`);
    if (!response.ok) {
      throw new Error("Failed to fetch items");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching items:", error);
    return [];
  }
};

interface Cluster {
  region: string;
  name: string;
  clan_limit: number;
}

export async function getClusters(): Promise<Cluster[]> {
  try {
    const response = await fetch(`${config.API_URL}/clusters`);
    if (!response.ok) {
      throw new Error("Error fetching clusters");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching clusters:", error);
    return [];
  }
}

export function getStoredItem(key: string): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  const localValue = localStorage.getItem(key);
  if (localValue) {
    return localValue;
  }

  const sessionValue = sessionStorage.getItem(key);
  return sessionValue;
}

export function closeSession(): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem("token");
  localStorage.removeItem("discordid");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("discordid");
}
