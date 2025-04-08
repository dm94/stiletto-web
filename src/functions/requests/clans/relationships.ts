import { getStoredItem } from "../../services";
import { config } from "../../../config/config";
import type {
  CreateRelationshipRequestQueryParams,
  RelationshipInfo,
} from "../../../types/dto/relationship";
import { objectToURLSearchParams } from "../../utils";
import type { GenericResponse } from "../../../types/dto/generic";

export const getRelationships = async (
  clanid: number,
): Promise<RelationshipInfo[]> => {
  const response = await fetch(
    `${config.API_URL}/clans/${clanid}/relationships`,
    {
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

export const createRelationship = async (
  clanid: number,
  request: CreateRelationshipRequestQueryParams,
): Promise<GenericResponse> => {
  const params = objectToURLSearchParams(request);

  const response = await fetch(
    `${config.API_URL}/clans/${clanid}/relationships?${params}`,
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

export const deleteRelationship = async (
  clanId: number,
  relationShipId: number,
): Promise<GenericResponse> => {
  const response = await fetch(
    `${config.API_URL}/clans/${clanId}/relationships/${relationShipId}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getStoredItem("token")}` },
    },
  );

  if (response) {
    return await response.json();
  }

  throw new Error("errors.apiConnection");
};
