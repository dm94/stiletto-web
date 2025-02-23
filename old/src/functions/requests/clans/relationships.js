import { getStoredItem } from "../../services";
import { config } from "../../../config/config";

export const getRelationships = async (clanid) => {
  try {
    return await fetch(
      `${config.REACT_APP_API_URL}/clans/${clanid}/relationships`,
      {
        headers: {
          Authorization: `Bearer ${getStoredItem("token")}`,
        },
      }
    );
  } catch {
    throw new Error("Error when connecting to the API");
  }
}

export const createRelationship = async (clanid, {
  nameotherclan,
  clanflag,
  typed,
  symbol,
}) => {
  const params = new URLSearchParams({
    nameotherclan: nameotherclan,
    clanflag: clanflag,
    typed: typed,
    symbol: symbol,
  });

  try {
    return await fetch(
      `${config.REACT_APP_API_URL}/clans/${clanid}/relationships?${params}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getStoredItem("token")}`,
        },
      }
    );
  } catch {
    throw new Error("Error when connecting to the API");
  }
}

export const deleteRelationship = async (clanId, relationShipId) => {
  try {
    return await fetch(`${config.REACT_APP_API_URL}/clans/${clanId}/relationships/${relationShipId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getStoredItem("token")}` },
    });
  } catch {
    throw new Error("Error when connecting to the API");
  }
}
