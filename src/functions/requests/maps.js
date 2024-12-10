import { getStoredItem } from "../services";


export const createMap = async (mapNameInput, mapDateInput, mapSelectInput) => {
  const url = new URL(`${process.env.REACT_APP_API_URL}/maps`);
  url.searchParams.append("mapname", mapNameInput);
  url.searchParams.append("mapdate", mapDateInput);
  url.searchParams.append("maptype", `${mapSelectInput}_new`);

  const headers = getStoredItem("token")
    ? { Authorization: `Bearer ${getStoredItem("token")}` }
    : {};

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
    });

    if (response.ok) {
      return await response.json();
    }
  } catch {
    throw new Error("Error when connecting to the API");
  }
};