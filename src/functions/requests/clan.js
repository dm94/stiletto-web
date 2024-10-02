import { getStoredItem } from "../services";

export const getWhoHasLearntIt = async (clan, tree, tech) => {
  const token = getStoredItem("token");
  let allUsers = [];

  if (token == null || !clan || !tree || !tech) {
    return allUsers;
  }

  const params = new URLSearchParams({
    tree: tree,
    tech: tech,
  });

  const url = `${
    process.env.REACT_APP_API_URL
  }/clans/${clan}/tech?${params.toString()}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getStoredItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error when connecting to the API");
    }

    const data = await response.json();

    if (data) {
      allUsers = data.map((user) => {
        return user.discordtag;
      });
    }

  } catch (error) {
    throw new Error("Error when connecting to the API");
  }

  return allUsers;
};