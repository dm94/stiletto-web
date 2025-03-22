import { config } from "../../../config/config";
import type { GenericResponse } from "../../../types/dto/generic";
import type {
  AddResourceMapRequestParams,
  EditResourceRequestParams,
  ResourceInfo,
} from "../../../types/dto/resources";
import { objectToURLSearchParams } from "../../utils";

export const getResources = async (
  mapId: number,
  mapPass: string,
): Promise<ResourceInfo[]> => {
  const params = objectToURLSearchParams({
    mappass: mapPass,
  });

  const response = await fetch(
    `${config.REACT_APP_API_URL}/maps/${mapId}/resources?${params}`,
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
  requestParams: AddResourceMapRequestParams,
): Promise<GenericResponse> => {
  const params = objectToURLSearchParams(requestParams);

  const response = await fetch(
    `${config.REACT_APP_API_URL}/maps/${mapId}/resources?${params}`,
    {
      method: "POST",
    },
  );
  if (response) {
    return await response.json();
  }

  throw new Error("errors.apiConnection");
};

export const editResource = async (
  mapId: number,
  resourceId: number,
  requestParams: EditResourceRequestParams,
): Promise<GenericResponse> => {
  const params = objectToURLSearchParams(requestParams);

  const response = await fetch(
    `${config.REACT_APP_API_URL}/maps/${mapId}/resources/${resourceId}/?${params}`,
    {
      method: "PUT",
    },
  );
  if (response) {
    return await response.json();
  }

  throw new Error("errors.apiConnection");
};

export const deleteResource = async (
  mapId: number,
  resourceId: number,
  token: string,
): Promise<Response> => {
  const params = new URLSearchParams({
    token,
  });

  const response = await fetch(
    `${config.REACT_APP_API_URL}/maps/${mapId}/resources/${resourceId}?${params}`,
    {
      method: "DELETE",
    },
  );

  if (response) {
    return await response.json();
  }

  throw new Error("errors.apiConnection");
};
