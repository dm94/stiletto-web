import { config } from "@/config/config";

export const getRecipe = async (id: string): Promise<Response> => {
  const url = `${config.API_URL}/recipes/${id}`;
  return fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
};
