import { getStoredItem } from "../../services";
import { config } from "../../../config/config";

export const updateMemberPermissions = async (
  clanid,
  memberid,
  permissions,
) => {
  try {
    return await fetch(
      `${config.REACT_APP_API_URL}/clans/${clanid}/members/${memberid}/permissions`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${getStoredItem("token")}`,
        },
        body: JSON.stringify(permissions),
      },
    );
  } catch {
    throw new Error("error.databaseConnection");
  }
};

export const updateMember = async (clanid, memberid, action) => {
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

export const getMembers = async (clanid) => {
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

export const getMemberPermissions = async (clanid, discordid) => {
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
