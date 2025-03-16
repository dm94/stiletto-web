import { getStoredItem } from "../services";
import { config } from "../../config/config";

export const getTrades = async ({
  pageSize = 10,
  page = 1,
  type,
  resource,
  region,
}) => {
  try {
    const params = new URLSearchParams({
      pageSize,
      page,
      ...(type && { type }),
      ...(resource && { resource }),
      ...(region && { region }),
    });

    return await fetch(`${config.REACT_APP_API_URL}/trades?${params}`);
  } catch {
    throw new Error("error.databaseConnection");
  }
};

export const deleteTrade = async (idTrade) => {
  try {
    return await fetch(`${config.REACT_APP_API_URL}/trades/${idTrade}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getStoredItem("token")}`,
      },
    });
  } catch {
    throw new Error("error.databaseConnection");
  }
};

export const createTrade = async ({
  resource,
  type,
  amount,
  region,
  quality,
  price,
}) => {
  try {
    const params = new URLSearchParams({
      resource,
      type,
      amount,
      region,
      quality,
      price,
    });

    return await fetch(`${config.REACT_APP_API_URL}/trades?${params}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getStoredItem("token")}`,
      },
    });
  } catch {
    throw new Error("error.databaseConnection");
  }
};
