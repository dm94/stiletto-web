import { getStoredItem } from "../services";
import { config } from "../../config/config";
import type {
  GetWalkersRequestParams,
  EditWalkerRequestParams,
} from "../../types/dto/walkers";
import { objectToURLSearchParams } from "../utils";

export const getWalkers = async ({
  pageSize = 20,
  page = 1,
  name = undefined,
  type = undefined,
  desc = undefined,
  use = undefined,
  ready,
}: GetWalkersRequestParams): Promise<Response> => {
  try {
    const params = new URLSearchParams({
      pageSize: pageSize.toString(),
      page: page.toString(),
      ...(name && { name }),
      ...(type && { type }),
      ...(desc && { desc }),
      ...(use && { use }),
      ...(ready !== undefined && { ready: ready.toString() }),
    });

    return await fetch(`${config.REACT_APP_API_URL}/walkers?${params}`, {
      headers: {
        Authorization: `Bearer ${getStoredItem("token")}`,
      },
    });
  } catch {
    throw new Error("error.databaseConnection");
  }
};

export const editWalker = async (
  walkerid: string,
  requestParams: EditWalkerRequestParams,
): Promise<Response> => {
  const params = objectToURLSearchParams(requestParams);

  try {
    return await fetch(
      `${config.REACT_APP_API_URL}/walkers/${walkerid}?${params}`,
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

export const getDiscordServers = async (
  code: string,
  redirect: string,
): Promise<Response> => {
  try {
    const params = new URLSearchParams({
      code,
      redirect,
    });

    return await fetch(`${config.REACT_APP_API_URL}/walkers/auth?${params}`, {
      headers: {
        Authorization: `Bearer ${getStoredItem("token")}`,
      },
    });
  } catch {
    throw new Error("error.databaseConnection");
  }
};

export const deleteWalker = async (walkerID: string): Promise<Response> => {
  try {
    return await fetch(`${config.REACT_APP_API_URL}/walkers/${walkerID}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getStoredItem("token")}`,
      },
    });
  } catch {
    throw new Error("error.databaseConnection");
  }
};
