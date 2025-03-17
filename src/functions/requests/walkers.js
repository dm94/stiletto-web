import { getStoredItem } from "../services";
import { config } from "../../config/config";

export const getWalkers = async ({
  pageSize = 20,
  page = 1,
  name = undefined,
  type = undefined,
  desc = undefined,
  use = undefined,
  ready,
}) => {
  try {
    const params = new URLSearchParams({
      pageSize,
      page,
      ...(name && { name }),
      ...(type && { type }),
      ...(desc && { desc }),
      ...(use && { use }),
      ...(ready !== "All" && { ready: ready === "Yes" }),
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

export const editWalker = async ({
  walkerID,
  owner,
  use,
  type,
  description,
  ready,
}) => {
  const params = new URLSearchParams({
    owner,
    use,
    type,
    description,
    ready,
  });

  try {
    return await fetch(
      `${config.REACT_APP_API_URL}/walkers/${walkerID}?${params}`,
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

export const getDiscordServers = async (code, redirect) => {
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

export const deleteWalker = async (walkerID) => {
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
