import { getStoredItem } from "../services";
import { config } from "../../config/config";

export const createMap = async (mapNameInput, mapDateInput, mapSelectInput) => {
  const url = new URL(`${config.REACT_APP_API_URL}/maps`);
  url.searchParams.append("mapname", mapNameInput);
  url.searchParams.append("mapdate", mapDateInput);
  url.searchParams.append("maptype", `${mapSelectInput}_new`);

  const headers = getStoredItem("token")
    ? { Authorization: `Bearer ${getStoredItem("token")}` }
    : {};

  try {
    return await fetch(url, {
      method: "POST",
      headers,
    });
  } catch {
    throw new Error("Error when connecting to the API");
  }
};

export const editMap = async (mapid, mapname, mapdate, allowediting, mappass) => {
  const url = new URL(`${config.REACT_APP_API_URL}/maps/${mapid}`);
  url.searchParams.append("mapname", mapname);
  url.searchParams.append("mapdate", mapdate);
  url.searchParams.append("allowediting", allowediting);
  url.searchParams.append("mappass", mappass);

  const headers = getStoredItem("token")
    ? { Authorization: `Bearer ${getStoredItem("token")}` }
    : {};

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers,
    });

    if (response.ok) {
      return "Map updated";
    }
  } catch {
    throw new Error("Error when connecting to the API");
  }
}

export const getMap = async (mapid, mappass) => {
  const url = new URL(`${config.REACT_APP_API_URL}/maps/${mapid}`);
  url.searchParams.append("mappass", mappass);

  try {
    const response = await fetch(url, {
      method: "GET",
    });

    if (response.status === 200) {
      const json = await response.json();
      return {
        success: true,
        data: json,
      }
    }

    if (response.status === 401) {
      return {
        success: false,
        message: "Unauthorized",
      }
    }

    if (response.status === 503) {
      return {
        success: false,
        message: "Error connecting to database",
      }
    }
  } catch {
    return {
      success: false,
      message: "Error when connecting to the API",
    }
  }
}

export const getMaps = async () => {
  try {
    return await fetch(`${config.REACT_APP_API_URL}/maps`, {
      headers: {
        Authorization: `Bearer ${getStoredItem("token")}`,
      },
    });
  } catch {
    throw new Error("Error when connecting to the API");
  }
}

export const deleteMap = async (mapid) => {
  try {
    return await fetch(
      `${config.REACT_APP_API_URL}/maps/${mapid}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getStoredItem("token")}`,
        },
      }
    );
  } catch {
    throw new Error("Error when connecting to the API");
  }
}