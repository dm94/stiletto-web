import { getStoredItem } from "../../services";
import { config } from "../../../config/config";

export const updateMemberPermissions = async (clanid, memberid, permissions) => {
  try {
    return await fetch(
      `${config.REACT_APP_API_URL}/clans/${clanid}/members/${memberid}/permissions`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${getStoredItem("token")}`,
        },
        body: JSON.stringify(permissions),
      }
    );
  } catch {
    throw new Error("Error when connecting to the API");
  }
}

export const updateMember = async (clanid, memberid, action) => {
  try {
    return await fetch(
      `${config.REACT_APP_API_URL}/clans/${clanid}/members/${memberid}?action=${action}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${getStoredItem("token")}`,
        },
      }
    );
  } catch {
    throw new Error("Error when connecting to the API");
  }
}
