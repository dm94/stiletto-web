import { getStoredItem } from "../services";
import { config } from "../../config/config";
import type { TechUser, Tree } from "../../types/dto/tech";
import type {
  CreateClanRequestParams,
  GetClansRequestParams,
  UpdateClanRequestParams,
} from "../../types/dto/clan";
import { objectToURLSearchParams } from "../utils";

export const getWhoHasLearntIt = async (
  clanId: string,
  tree: Tree,
  tech: string,
): Promise<string[]> => {
  const token = getStoredItem("token");
  let allUsers: string[] = [];

  if (token == null || !clanId || !tree || !tech) {
    return allUsers;
  }

  const params = new URLSearchParams({
    tree: tree,
    tech: tech,
  });

  // seeWhoHasLearntIt
  const url = `${
    config.REACT_APP_API_URL
  }/clans/${clanId}/tech?${params.toString()}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getStoredItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("error.databaseConnection");
    }

    const data = await response.json();

    if (data) {
      allUsers = data.map((user: TechUser) => user?.discordtag);
    }
  } catch {
    throw new Error("error.databaseConnection");
  }

  return allUsers;
};

export const leaveClan = async (): Promise<Response> => {
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
    throw new Error("error.databaseConnection");
  }
};

export const updateClan = async (
  clanid: number,
  requestParams: UpdateClanRequestParams,
): Promise<Response> => {
  const params = objectToURLSearchParams(requestParams);

  try {
    return await fetch(
      `${config.REACT_APP_API_URL}/clans/${clanid}?${params}`,
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

export const createClan = async (
  requestParams: CreateClanRequestParams,
): Promise<Response> => {
  const params = objectToURLSearchParams(requestParams);

  try {
    return await fetch(`${config.REACT_APP_API_URL}/clans?${params}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getStoredItem("token")}`,
      },
    });
  } catch {
    throw new Error("error.databaseConnection");
  }
};

export const getClans = async (
  requestParams: GetClansRequestParams,
): Promise<Response> => {
  const params = objectToURLSearchParams(requestParams);

  try {
    return await fetch(`${config.REACT_APP_API_URL}/clans?${params}`);
  } catch {
    throw new Error("error.databaseConnection");
  }
};

export const deleteClan = async (clanId: number): Promise<Response> => {
  try {
    return await fetch(`${config.REACT_APP_API_URL}/clans/${clanId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getStoredItem("token")}`,
      },
    });
  } catch {
    throw new Error("error.databaseConnection");
  }
};
