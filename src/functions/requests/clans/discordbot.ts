import { getStoredItem } from "../../services";
import { config } from "../../../config/config";
import type {
  DiscordConfig,
  UpdateBotConfigParams,
} from "../../../types/dto/discordConfig";
import { objectToURLSearchParams } from "../../utils";
import type { GenericResponse } from "../../../types/dto/generic";

export const getDiscordConfig = async (
  clanid: number,
): Promise<DiscordConfig> => {
  const response = await fetch(`${config.API_URL}/clans/${clanid}/discordbot`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getStoredItem("token")}`,
    },
  });

  if (response) {
    return await response.json();
  }

  throw new Error("errors.apiConnection");
};

export const updateBotConfig = async (
  clanid: number,
  queryParams: UpdateBotConfigParams,
): Promise<GenericResponse> => {
  const params = objectToURLSearchParams(queryParams);

  const response = await fetch(
    `${config.API_URL}/clans/${clanid}/discordbot?${params}`,
    {
      method: "PUT",
      headers: { Authorization: `Bearer ${getStoredItem("token")}` },
    },
  );

  if (response) {
    return await response.json();
  }

  throw new Error("errors.apiConnection");
};
