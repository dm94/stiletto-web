import { getStoredItem } from "../../services";
import { config } from "../../../config/config";

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
