import { getStoredItem } from "../services";
import { config } from "../../config/config";
import type {
  CreateTradeRequestParams,
  GetTradesQueryParams,
  TradeInfo,
} from "../../types/dto/trades";
import { objectToURLSearchParams } from "../utils";
import type { GenericResponse } from "../../types/dto/generic";

export const getTrades = async (
  queryParams: GetTradesQueryParams,
): Promise<TradeInfo[]> => {
  const params = objectToURLSearchParams(queryParams);

  const response = await fetch(`${config.API_URL}/trades?${params}`, {
    method: "GET",
  });

  if (response) {
    return await response.json();
  }

  throw new Error("errors.apiConnection");
};

export const createTrade = async (
  requestParams: CreateTradeRequestParams,
): Promise<GenericResponse> => {
  const response = await fetch(`${config.API_URL}/trades`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getStoredItem("token")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestParams),
  });

  if (response?.ok) {
    return await response.json();
  }

  throw new Error("errors.apiConnection");
};

export const deleteTrade = async (tradeId: number): Promise<boolean> => {
  const response = await fetch(`${config.API_URL}/trades/${tradeId}`, {
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
