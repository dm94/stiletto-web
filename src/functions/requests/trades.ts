import { getStoredItem } from "../services";
import { config } from "../../config/config";
import type {
  CreateTradeRequestParams,
  GetTradesQueryParams,
} from "../../types/dto/trades";
import { objectToURLSearchParams } from "../utils";

export const getTrades = async (
  queryParams: GetTradesQueryParams,
): Promise<Response> => {
  try {
    const params = objectToURLSearchParams(queryParams);

    return await fetch(`${config.REACT_APP_API_URL}/trades?${params}`);
  } catch {
    throw new Error("error.databaseConnection");
  }
};

export const deleteTrade = async (tradeId: number): Promise<Response> => {
  try {
    return await fetch(`${config.REACT_APP_API_URL}/trades/${tradeId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getStoredItem("token")}`,
      },
    });
  } catch {
    throw new Error("error.databaseConnection");
  }
};

export const createTrade = async (
  requestParams: CreateTradeRequestParams,
): Promise<Response> => {
  try {
    const params = objectToURLSearchParams(requestParams);

    return await fetch(`${config.REACT_APP_API_URL}/trades?${params}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getStoredItem("token")}`,
      },
    });
  } catch {
    throw new Error("error.databaseConnection");
  }
};
