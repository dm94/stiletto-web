import { config } from "@config/config";
import type { GenericResponse } from "@ctypes/dto/generic";
import type {
  AddMapRequestParams,
  AddMapResponse,
  EditMapRequestParams,
  MapInfo,
} from "@ctypes/dto/maps";
import { getStoredItem } from "../../services";
import { objectToURLSearchParams } from "../../utils";

export const getMaps = async (): Promise<MapInfo[]> => {
  const response = await fetch(`${config.REACT_APP_API_URL}/maps`, {
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

  const response = await fetch(`${config.REACT_APP_API_URL}/maps?${params}`, {
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

  const response = await fetch(
    `${config.REACT_APP_API_URL}/maps/${mapid}?${params}`,
    {
      method: "GET",
    },
  );

  if (response) {
    return await response.json();
  }

  throw new Error("errors.apiConnection");
};

export const editMap = async (
  mapId: number,
  requestParams: EditMapRequestParams,
): Promise<GenericResponse> => {
  const url = new URL(`${config.REACT_APP_API_URL}/maps/${mapId}`);
  for (const key in requestParams) {
    url.searchParams.append(
      key,
      String(requestParams[key as keyof EditMapRequestParams]),
    );
  }

  const headers = getStoredItem("token")
    ? { Authorization: `Bearer ${getStoredItem("token")}` }
    : {};

  const response = await fetch(url, {
    method: "PUT",
    headers: headers as Record<string, string>,
  });

  if (response) {
    return await response.json();
  }

  throw new Error("errors.apiConnection");
};

export const deleteMap = async (mapId: number): Promise<GenericResponse> => {
  const response = await fetch(`${config.REACT_APP_API_URL}/maps/${mapId}`, {
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
