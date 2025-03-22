import { getStoredItem } from "../services";
import { config } from "../../config/config";
import type {
  GetWalkersRequestParams,
  EditWalkerRequestParams,
} from "../../types/dto/walkers";
import { objectToURLSearchParams } from "../utils";
import type { GenericResponse } from "../../types/dto/generic";

export const getWalkers = async (
  requestParams: GetWalkersRequestParams,
): Promise<Response> => {
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
  requestParams: EditWalkerRequestParams,
): Promise<GenericResponse> => {
  const params = objectToURLSearchParams(requestParams);

  const response = await fetch(
    `${config.REACT_APP_API_URL}/walkers/${walkerId}?${params}`,
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

export const deleteWalker = async (
  walkerId: string,
): Promise<GenericResponse> => {
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
    return await response.json();
  }

  throw new Error("errors.apiConnection");
};
