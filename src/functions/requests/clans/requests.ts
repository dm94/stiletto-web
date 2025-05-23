import { getStoredItem } from "../../services";
import { config } from "@config/config";
import type { RequestAction } from "@ctypes/dto/requests";
import type { MemberRequest } from "@ctypes/dto/members";
import type { GenericResponse } from "@ctypes/dto/generic";
import { objectToURLSearchParams } from "../../utils";

export const getRequests = async (clanId: number): Promise<MemberRequest[]> => {
  const response = await fetch(`${config.API_URL}/clans/${clanId}/requests`, {
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

export const sendRequest = async (
  clanId: number,
  message: string,
): Promise<GenericResponse> => {
  const params = objectToURLSearchParams({
    message: message,
  });

  const response = await fetch(
    `${config.API_URL}/clans/${clanId}/requests?${params}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getStoredItem("token")}`,
      },
    },
  );

  if (response) {
    return await response.json();
  }

  throw new Error("errors.apiConnection");
};

export const updateRequest = async (
  clanId: number,
  requestid: string,
  action: RequestAction,
): Promise<GenericResponse> => {
  const response = await fetch(
    `${config.API_URL}/clans/${clanId}/requests/${requestid}?action=${action}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${getStoredItem("token")}`,
      },
    },
  );

  if (response) {
    return await response.json();
  }

  throw new Error("errors.apiConnection");
};
