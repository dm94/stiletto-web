import { config } from "@config/config";
import type { Recipe, RecipeListInfo } from "@ctypes/dto/recipe";

export const addRecipe = async (items: Recipe[]): Promise<RecipeListInfo> => {
  const response = await fetch(`${config.API_URL}/recipes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items: items,
    }),
  });

  if (response) {
    return await response.json();
  }

  throw new Error("errors.apiConnection");
};

export const getRecipe = async (
  recipeToken: string,
): Promise<RecipeListInfo> => {
  const response = await fetch(`${config.API_URL}/recipes/${recipeToken}`, {
    method: "GET",
  });

  if (response) {
    return await response.json();
  }

  throw new Error("errors.apiConnection");
};
