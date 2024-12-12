import { config } from "../../config/config";

export const addRecipe = async (items) => {
  try {
    return await fetch(`${config.REACT_APP_API_URL}/recipes`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: JSON.stringify(items),
          }),
        });

  } catch {
    throw new Error("Error when connecting to the API");
  }
}