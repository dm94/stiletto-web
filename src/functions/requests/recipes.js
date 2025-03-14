import { config } from "../../config/config";

export const addRecipe = async (items) => {
  try {
    return await fetch(`${config.REACT_APP_API_URL}/recipes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: items,
      }),
    });
  } catch {
    throw new Error("Error when connecting to the API");
  }
};

export const getRecipe = async (recipe) => {
  try {
    return await fetch(`${config.REACT_APP_API_URL}/recipes/${recipe}`);
  } catch {
    throw new Error("Error when connecting to the API");
  }
};
