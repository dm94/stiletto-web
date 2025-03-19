import { config } from "../../config/config";
import type { Recipe } from "../../types/dto/recipe";

export const addRecipe = async (items: Recipe[]): Promise<Response> => {
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
    throw new Error("error.databaseConnection");
  }
};

export const getRecipe = async (recipeToken: string): Promise<Response> => {
  try {
    return await fetch(`${config.REACT_APP_API_URL}/recipes/${recipeToken}`);
  } catch {
    throw new Error("error.databaseConnection");
  }
};
