import { getStoredItem } from "../services";
import { config } from "../../config/config";
import type { TechTreeInfo, Tree } from "../../types/dto/tech";
import type { LoginInfo, UserInfo } from "../../types/dto/users";
import { objectToURLSearchParams } from "../utils";

export const getUser = async (): Promise<UserInfo> => {
  const response = await fetch(`${config.REACT_APP_API_URL}/users`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getStoredItem("token")}`,
    },
  });

  if (response.ok) {
    return await response.json();
  }

  throw new Error("errors.apiConnection");
};

export const addNick = async (newNick: string): Promise<boolean> => {
  const response = await fetch(`${config.REACT_APP_API_URL}/users`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${getStoredItem("token")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      dataupdate: newNick,
    }),
  });

  if (response.ok) {
    return response.ok;
  }

  throw new Error("errors.apiConnection");
};

export const deleteUser = async (): Promise<boolean> => {
  const response = await fetch(`${config.REACT_APP_API_URL}/users`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getStoredItem("token")}` },
  });

  if (response.ok) {
    return response.ok;
  }

  throw new Error("errors.apiConnection");
};

export const getLearned = async (
  discordId: string,
  tree: Tree,
): Promise<TechTreeInfo> => {
  const params = objectToURLSearchParams({
    tree: tree,
  });

  const response = await fetch(
    `${config.REACT_APP_API_URL}/users/${discordId}/tech?${params}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getStoredItem("token")}`,
      },
    },
  );

  if (response.ok) {
    return await response.json();
  }

  throw new Error("errors.apiConnection");
};

export const addTech = async (
  discordId: string,
  tabSelect: Tree,
  learned: string[],
): Promise<TechTreeInfo> => {
  const params = new URLSearchParams({
    tree: tabSelect,
  });

  const response = await fetch(
    `${config.REACT_APP_API_URL}/users/${discordId}/tech?${params.toString()}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getStoredItem("token")}`,
      },
      body: JSON.stringify(learned),
    },
  );

  if (response) {
    return await response.json();
  }

  throw new Error("errors.apiConnection");
};

export const authDiscord = async (code: string): Promise<LoginInfo> => {
  const response = await fetch(`${config.REACT_APP_API_URL}/users/auth`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code: code,
    }),
  });

  if (response) {
    return await response.json();
  }

  throw new Error("errors.apiConnection");
};
