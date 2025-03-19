import { getStoredItem } from "../../services";
import { config } from "../../../config/config";
import type {
  MemberAction,
  UpdateMemberPermissionsQueryParams,
} from "../../../types/dto/members";
import { objectToURLSearchParams } from "../../utils";

export const updateMemberPermissions = async (
  clanid: number,
  memberid: string,
  permissions: UpdateMemberPermissionsQueryParams,
): Promise<Response> => {
  const params = objectToURLSearchParams(permissions);

  try {
    return await fetch(
      `${config.REACT_APP_API_URL}/clans/${clanid}/members/${memberid}/permissions?${params}`,
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

export const updateMember = async (
  clanid: number,
  memberid: string,
  action: MemberAction,
): Promise<Response> => {
  try {
    return await fetch(
      `${config.REACT_APP_API_URL}/clans/${clanid}/members/${memberid}?action=${action}`,
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

export const getMembers = async (clanid: number): Promise<Response> => {
  try {
    return await fetch(`${config.REACT_APP_API_URL}/clans/${clanid}/members`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getStoredItem("token")}`,
      },
    });
  } catch {
    throw new Error("error.databaseConnection");
  }
};

export const getMemberPermissions = async (
  clanid: number,
  discordid: string,
): Promise<Response> => {
  try {
    return await fetch(
      `${config.REACT_APP_API_URL}/clans/${clanid}/members/${discordid}/permissions`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getStoredItem("token")}`,
        },
      },
    );
  } catch {
    throw new Error("error.databaseConnection");
  }
};
