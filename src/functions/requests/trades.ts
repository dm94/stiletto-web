import { getStoredItem } from "../services";
import { config } from "@config/config";
import type {
  CreateTradeRequestParams,
  GetTradesQueryParams,
  TradeInfo,
} from "@ctypes/dto/trades";
import { objectToURLSearchParams } from "../utils";
import type { GenericResponse } from "@ctypes/dto/generic";

export const getTrades = async (
  queryParams: GetTradesQueryParams,
): Promise<TradeInfo[]> => {
  const params = objectToURLSearchParams(queryParams);

  const response = await fetch(`${config.REACT_APP_API_URL}/trades?${params}`, {
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
  const params = objectToURLSearchParams(requestParams);

  const response = await fetch(`${config.REACT_APP_API_URL}/trades?${params}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getStoredItem("token")}`,
    },
  });

  if (response) {
    return await response.json();
  }

  throw new Error("errors.apiConnection");
};

export const deleteTrade = async (
  tradeId: number,
): Promise<GenericResponse> => {
  const response = await fetch(
    `${config.REACT_APP_API_URL}/trades/${tradeId}`,
    {
      method: "DELETE",
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
