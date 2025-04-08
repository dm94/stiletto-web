import { config } from "../../../config/config";
import type { GenericResponse } from "../../../types/dto/generic";
import type {
  AddResourceMapRequestBody,
  EditResourceRequestBody,
  ResourceInfo,
} from "../../../types/dto/resources";
import { getStoredItem } from "../../services";
import { objectToURLSearchParams } from "../../utils";

export const getResources = async (
  mapId: number,
  mapPass: string,
): Promise<ResourceInfo[]> => {
  const params = objectToURLSearchParams({
    mappass: mapPass,
  });

  const response = await fetch(
    `${config.API_URL}/maps/${mapId}/resources?${params}`,
    {
      method: "GET",
    },
  );
  if (response) {
    return await response.json();
  }

  throw new Error("errors.apiConnection");
};

export const addResourceMap = async (
  mapId: number,
  mappass: string,
  requestBody: AddResourceMapRequestBody,
): Promise<GenericResponse> => {
  const headers = getStoredItem("token")
    ? {
        Authorization: `Bearer ${getStoredItem("token")}`,
        "Content-Type": "application/json",
      }
    : { "Content-Type": "application/json" };

  const response = await fetch(
    `${config.API_URL}/maps/${mapId}/resources?mappass=${mappass}`,
    {
      method: "POST",
      headers: headers as Record<string, string>,
      body: JSON.stringify(requestBody),
    },
  );
  if (response.ok) {
    return await response.json();
  }

  throw new Error("errors.apiConnection");
};

export const editResource = async (
  mapId: number,
  resourceId: number,
  requestBody: EditResourceRequestBody,
): Promise<GenericResponse> => {
  const response = await fetch(
    `${config.API_URL}/maps/${mapId}/resources/${resourceId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    },
  );
  if (response.ok) {
    return await response.json();
  }

  throw new Error("errors.apiConnection");
};

export const deleteResource = async (
  mapId: number,
  resourceId: number,
  token: string,
): Promise<boolean> => {
  const params = new URLSearchParams({
    token,
  });

  const response = await fetch(
    `${config.API_URL}/maps/${mapId}/resources/${resourceId}?${params}`,
    {
      method: "DELETE",
    },
  );

  if (response.ok) {
    return response.ok;
  }

  throw new Error("errors.apiConnection");
};
