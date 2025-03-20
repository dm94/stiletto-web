import { getStoredItem } from "../../services";
import { config } from "../../../config/config";
import type { RequestAction } from "../../../types/dto/requests";

export const sendRequest = async (
  clanId: number,
  message: string,
): Promise<Response> => {
  try {
    return await fetch(`${config.REACT_APP_API_URL}/clans/${clanId}/requests`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getStoredItem("token")}`,
      },
      body: new URLSearchParams({
        message: message,
      }),
    });
  } catch {
    throw new Error("error.databaseConnection");
  }
};

export const getRequests = async (clanId: number): Promise<Response> => {
  try {
    return await fetch(`${config.REACT_APP_API_URL}/clans/${clanId}/requests`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getStoredItem("token")}`,
      },
    });
  } catch {
    throw new Error("error.databaseConnection");
  }
};

export const updateRequest = async (
  clanId: number,
  requestid: string,
  action: RequestAction,
): Promise<Response> => {
  try {
    return await fetch(
      `${config.REACT_APP_API_URL}/clans/${clanId}/requests/${requestid}?action=${action}`,
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
