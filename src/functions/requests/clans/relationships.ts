import { getStoredItem } from "../../services";
import { config } from "../../../config/config";
import type { CreateRelationshipRequestQueryParams } from "../../../types/dto/relationship";
import { objectToURLSearchParams } from "../../utils";

export const getRelationships = async (clanid: number): Promise<Response> => {
  try {
    return await fetch(
      `${config.REACT_APP_API_URL}/clans/${clanid}/relationships`,
      {
        headers: {
          Authorization: `Bearer ${getStoredItem("token")}`,
        },
      },
    );
  } catch {
    throw new Error("error.databaseConnection");
  }
};

export const createRelationship = async (
  clanid: number,
  request: CreateRelationshipRequestQueryParams,
): Promise<Response> => {
  const params = objectToURLSearchParams(request);

  try {
    return await fetch(
      `${config.REACT_APP_API_URL}/clans/${clanid}/relationships?${params}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getStoredItem("token")}`,
        },
      },
    );
  } catch {
    throw new Error("error.databaseConnection");
  }
};

export const deleteRelationship = async (
  clanId: number,
  relationShipId: number,
) => {
  try {
    return await fetch(
      `${config.REACT_APP_API_URL}/clans/${clanId}/relationships/${relationShipId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getStoredItem("token")}` },
      },
    );
  } catch {
    throw new Error("error.databaseConnection");
  }
};
