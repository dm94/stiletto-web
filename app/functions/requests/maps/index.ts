import { config } from "@config/config";
import type { GenericResponse } from "@ctypes/dto/generic";
import type {
  AddMapRequestParams,
  AddMapResponse,
  EditMapRequestBody,
  MapInfo,
} from "@ctypes/dto/maps";
import { getStoredItem } from "../../services";
import { objectToURLSearchParams } from "../../utils";

export const getMaps = async (): Promise<MapInfo[]> => {
  const response = await fetch(`${config.API_URL}/maps`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getStoredItem("token")}`,
    },
  });

  if (response) {
    return await response.json();
  }

  throw new Error("errors.apiConnection");
};

export const addMap = async (
  requestParams: AddMapRequestParams,
): Promise<AddMapResponse> => {
  const params = objectToURLSearchParams(requestParams);

  const headers = getStoredItem("token")
    ? { Authorization: `Bearer ${getStoredItem("token")}` }
    : {};

  const response = await fetch(`${config.API_URL}/maps?${params}`, {
    method: "POST",
    headers: headers as Record<string, string>,
  });

  if (response) {
    return await response.json();
  }

  throw new Error("errors.apiConnection");
};

export const getMap = async (
  mapid: number,
  mappass: string,
): Promise<MapInfo> => {
  const params = objectToURLSearchParams({
    mappass: mappass,
  });

  const response = await fetch(`${config.API_URL}/maps/${mapid}?${params}`, {
    method: "GET",
  });

  if (response) {
    return await response.json();
  }

  throw new Error("errors.apiConnection");
};

export const editMap = async (
  mapId: number,
  requestBody: EditMapRequestBody,
): Promise<GenericResponse> => {
  const headers = getStoredItem("token")
    ? {
        Authorization: `Bearer ${getStoredItem("token")}`,
        "Content-Type": "application/json",
      }
    : { "Content-Type": "application/json" };

  const response = await fetch(`${config.API_URL}/maps/${mapId}`, {
    method: "PUT",
    headers: headers as Record<string, string>,
    body: JSON.stringify(requestBody),
  });

  if (response) {
    return await response.json();
  }

  throw new Error("errors.apiConnection");
};

export const deleteMap = async (mapId: number): Promise<GenericResponse> => {
  const response = await fetch(`${config.API_URL}/maps/${mapId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getStoredItem("token")}`,
    },
  });

  if (response) {
    return await response.json();
  }

  throw new Error("errors.apiConnection");
};

export const getMapInfo = async (mapid: number): Promise<MapInfo> => {
  const response = await fetch(`${config.API_URL}/maps/${mapid}/mapinfo`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getStoredItem("token")}`,
    },
  });

  if (!response.ok) {
    throw new Error("errors.apiConnection");
  }

  return await response.json();
};
