import { getStoredItem } from "../../services";
import { config } from "../../../config/config";
import { objectToURLSearchParams } from "../../utils";
import type { GenericResponse } from "../../../types/dto/generic";
import type {
  ClanInfo,
  CreateClanRequestParams,
  GetClansRequestParams,
  UpdateClanRequestParams,
} from "../../../types/dto/clan";

export const getClanInfo = async (clanid: number): Promise<ClanInfo> => {
  const response = await fetch(`${config.API_URL}/clans/${clanid}`, {
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

export const updateClan = async (
  clanid: number,
  requestParams: UpdateClanRequestParams,
): Promise<GenericResponse> => {
  const params = objectToURLSearchParams(requestParams);

  const response = await fetch(`${config.API_URL}/clans/${clanid}?${params}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${getStoredItem("token")}`,
    },
  });

  if (response) {
    return await response.json();
  }

  throw new Error("errors.apiConnection");
};

export const deleteClan = async (clanId: number): Promise<boolean> => {
  const response = await fetch(`${config.API_URL}/clans/${clanId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getStoredItem("token")}`,
    },
  });

  if (response.ok) {
    return response.ok;
  }

  throw new Error("errors.apiConnection");
};

export const getClans = async (
  requestParams: GetClansRequestParams,
): Promise<ClanInfo[]> => {
  const params = objectToURLSearchParams(requestParams);

  const response = await fetch(`${config.API_URL}/clans?${params}`);
  if (response) {
    return await response.json();
  }

  throw new Error("errors.apiConnection");
};

export const createClan = async (
  requestParams: CreateClanRequestParams,
): Promise<Response> => {
  const params = objectToURLSearchParams(requestParams);

  const response = await fetch(`${config.API_URL}/clans?${params}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getStoredItem("token")}`,
    },
  });

  if (response.ok) {
    return await response.json();
  }

  throw new Error("errors.apiConnection");
};

export const leaveClan = async (): Promise<GenericResponse> => {
  const response = await fetch(`${config.API_URL}/clans`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getStoredItem("token")}` },
  });

  if (response) {
    return await response.json();
  }

  throw new Error("errors.apiConnection");
};
