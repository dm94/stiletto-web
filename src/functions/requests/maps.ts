import { getStoredItem } from "../services";
import { config } from "../../config/config";
import type { AddMapRequestParams } from "../../types/dto/maps";
import type { AddResourceRequestParams } from "../../types/dto/resources";
import { objectToURLSearchParams } from "../utils";
import type { MapData } from "../../types/maps";

export const createMap = async (
  requestParams: AddMapRequestParams,
): Promise<Response> => {
  const url = new URL(`${config.REACT_APP_API_URL}/maps`);
  url.searchParams.append("mapname", requestParams.mapname);
  url.searchParams.append("mapdate", requestParams.mapdate);
  url.searchParams.append("maptype", `${requestParams.maptype}_new`);

  const headers = getStoredItem("token")
    ? { Authorization: `Bearer ${getStoredItem("token")}` }
    : {};

  try {
    return await fetch(url, {
      method: "POST",
      headers: headers as Record<string, string>,
    });
  } catch {
    throw new Error("error.databaseConnection");
  }
};

export const editMap = async (
  mapid: number,
  mapname: string,
  mapdate: string,
  allowediting: boolean,
  mappass: string,
): Promise<string | undefined> => {
  const url = new URL(`${config.REACT_APP_API_URL}/maps/${mapid}`);
  url.searchParams.append("mapname", mapname);
  url.searchParams.append("mapdate", mapdate);
  url.searchParams.append("allowediting", allowediting.toString());
  url.searchParams.append("mappass", mappass);

  const headers = getStoredItem("token")
    ? { Authorization: `Bearer ${getStoredItem("token")}` }
    : {};

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: headers as Record<string, string>,
    });

    if (response.ok) {
      return "Map updated";
    }
  } catch {
    throw new Error("error.databaseConnection");
  }
};

export const getMap = async (
  mapid: number,
  mappass: string,
): Promise<{
  success: boolean;
  data?: MapData;
  message?: string;
}> => {
  const url = new URL(`${config.REACT_APP_API_URL}/maps/${mapid}`);
  url.searchParams.append("mappass", mappass);

  try {
    const response = await fetch(url, {
      method: "GET",
    });

    if (response.status === 200) {
      const json = await response.json();
      return {
        success: true,
        data: json,
      };
    }

    if (response.status === 401) {
      return {
        success: false,
        message: "error.unauthorized",
      };
    }

    if (response.status === 503) {
      return {
        success: false,
        message: "error.databaseConnection",
      };
    }

    return {
      success: false,
    };
  } catch {
    return {
      success: false,
      message: "error.databaseConnection",
    };
  }
};

export const getMaps = async (): Promise<Response> => {
  try {
    return await fetch(`${config.REACT_APP_API_URL}/maps`, {
      headers: {
        Authorization: `Bearer ${getStoredItem("token")}`,
      },
    });
  } catch {
    throw new Error("error.databaseConnection");
  }
};

export const deleteMap = async (mapid: number): Promise<Response> => {
  try {
    return await fetch(`${config.REACT_APP_API_URL}/maps/${mapid}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getStoredItem("token")}`,
      },
    });
  } catch {
    throw new Error("error.databaseConnection");
  }
};

export const createResource = async (
  mapid: number,
  requestParams: AddResourceRequestParams,
): Promise<Response> => {
  const params = objectToURLSearchParams(requestParams);

  try {
    return await fetch(
      `${config.REACT_APP_API_URL}/maps/${mapid}/resources?${params}`,
      {
        method: "POST",
      },
    );
  } catch {
    throw new Error("error.databaseConnection");
  }
};

export const deleteResource = async (
  mapId: number,
  resourceId: number,
  token: string,
): Promise<Response> => {
  try {
    const params = new URLSearchParams({
      token,
    });

    return await fetch(
      `${config.REACT_APP_API_URL}/maps/${mapId}/resources/${resourceId}?${params}`,
      {
        method: "DELETE",
      },
    );
  } catch {
    throw new Error("error.databaseConnection");
  }
};

export const updateResourceTime = async (
  mapId: number,
  resoruceId: number,
  token: string,
  harvested: string,
): Promise<Response> => {
  try {
    const params = new URLSearchParams({
      token,
      harvested,
    });

    return await fetch(
      `${config.REACT_APP_API_URL}/maps/${mapId}/resources/${resoruceId}?${params}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${getStoredItem("token")}`,
        },
      },
    );
  } catch {
    throw new Error("error.databaseConnection");
  }
};

export const getResources = async (
  mapId: number,
  mappass: string,
): Promise<Response> => {
  try {
    const params = new URLSearchParams({
      mappass,
    });

    return await fetch(
      `${config.REACT_APP_API_URL}/maps/${mapId}/resources?${params}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getStoredItem("token")}`,
        },
      },
    );
  } catch {
    throw new Error("error.databaseConnection");
  }
};
