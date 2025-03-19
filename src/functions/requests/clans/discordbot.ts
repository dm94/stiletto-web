import { getStoredItem } from "../../services";
import { config } from "../../../config/config";
import type { UpdateBotConfigParams } from "../../../types/dto/discordConfig";
import { objectToURLSearchParams } from "../../utils";

export const getDiscordConfig = async (clanid: number): Promise<Response> => {
  try {
    return await fetch(
      `${config.REACT_APP_API_URL}/clans/${clanid}/discordbot`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getStoredItem("token")}`,
        },
      },
    );
  } catch {
    throw new Error("error.databaseConnection");
  }
};

export const updateBotConfig = async (
  clanid: number,
  queryParams: UpdateBotConfigParams,
) => {
  const params = objectToURLSearchParams(queryParams);

  try {
    return await fetch(
      `${config.REACT_APP_API_URL}/clans/${clanid}/discordbot?${params}`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${getStoredItem("token")}` },
      },
    );
  } catch {
    throw new Error("error.databaseConnection");
  }
};
