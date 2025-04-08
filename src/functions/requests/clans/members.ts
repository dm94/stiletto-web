import { getStoredItem } from "../../services";
import { config } from "../../../config/config";
import type {
  MemberAction,
  MemberInfo,
  UpdateMemberPermissionsQueryParams,
  Permissions,
} from "../../../types/dto/members";
import { objectToURLSearchParams } from "../../utils";
import type { GenericResponse } from "../../../types/dto/generic";

export const getMembers = async (clanId: number): Promise<MemberInfo[]> => {
  const response = await fetch(`${config.API_URL}/clans/${clanId}/members`, {
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

export const updateMember = async (
  clanid: number,
  memberid: string,
  action: MemberAction,
): Promise<GenericResponse> => {
  const response = await fetch(
    `${config.API_URL}/clans/${clanid}/members/${memberid}?action=${action}`,
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

export const getMemberPermissions = async (
  clanid: number,
  discordid: string,
): Promise<Permissions> => {
  const response = await fetch(
    `${config.API_URL}/clans/${clanid}/members/${discordid}/permissions`,
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

export const updateMemberPermissions = async (
  clanid: number,
  memberid: string,
  permissions: UpdateMemberPermissionsQueryParams,
): Promise<GenericResponse> => {
  const params = objectToURLSearchParams(permissions);

  const response = await fetch(
    `${config.API_URL}/clans/${clanid}/members/${memberid}/permissions?${params}`,
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
