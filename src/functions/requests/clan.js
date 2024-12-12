import { getStoredItem } from "../services";
import { config } from "../../config/config";

export const getWhoHasLearntIt = async (clan, tree, tech) => {
  const token = getStoredItem("token");
  let allUsers = [];

  if (token == null || !clan || !tree || !tech) {
    return allUsers;
  }

  const params = new URLSearchParams({
    tree: tree,
    tech: tech,
  });

  const url = `${config.REACT_APP_API_URL
    }/clans/${clan}/tech?${params.toString()}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getStoredItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error when connecting to the API");
    }

    const data = await response.json();

    if (data) {
      allUsers = data.map((user) => {
        return user.discordtag;
      });
    }
  } catch {
    throw new Error("Error when connecting to the API");
  }

  return allUsers;
};

export const leaveClan = async () => {
  const token = getStoredItem("token");

  if (!token) {
    throw new Error("Not logged in");
  }

  try {
    return await fetch(`${config.REACT_APP_API_URL}/clans`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    throw new Error("Error when connecting to the API");
  }
}

export const updateClan = async (clanid, {
  clanname,
  clancolor,
  clandiscord,
  symbol,
  region,
  recruit,
}) => {
  const params = new URLSearchParams({
    clanname,
    clancolor,
    clandiscord,
    symbol,
    region,
    recruit,
  });

  try {
    return await fetch(
      `${config.REACT_APP_API_URL}/clans/${clanid}?${params}`,
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

export const createClan = async ({
  clanname,
  clancolor,
  clandiscord,
  symbol,
  region,
  recruit,
}) => {
  const params = new URLSearchParams({
    clanname,
    clancolor,
    clandiscord,
    symbol,
    region,
    recruit,
  });

  try {
    return await fetch(
      `${config.REACT_APP_API_URL}/clans?${params}`,
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