import { getStoredItem } from "../services";
import { config } from "../../config/config";
import type {
  GetWalkersRequestParams,
  EditWalkerRequestBody,
  WalkerInfo,
} from "../../types/dto/walkers";
import { objectToURLSearchParams } from "../utils";
import type { GenericResponse } from "../../types/dto/generic";

export const getWalkers = async (
  requestParams: GetWalkersRequestParams,
): Promise<WalkerInfo[]> => {
  const params = objectToURLSearchParams(requestParams);

  const response = await fetch(
    `${config.REACT_APP_API_URL}/walkers?${params}`,
    {
      method: "GET",
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

export const editWalker = async (
  walkerId: string,
  requestParams: EditWalkerRequestBody,
): Promise<GenericResponse> => {
  const response = await fetch(
    `${config.REACT_APP_API_URL}/walkers/${walkerId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${getStoredItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestParams),
    },
  );

  if (response.ok) {
    return await response.json();
  }

  throw new Error("errors.apiConnection");
};

export const deleteWalker = async (walkerId: string): Promise<boolean> => {
  const response = await fetch(
    `${config.REACT_APP_API_URL}/walkers/${walkerId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getStoredItem("token")}`,
      },
    },
  );

  if (response) {
    return response.ok;
  }

  throw new Error("errors.apiConnection");
};
