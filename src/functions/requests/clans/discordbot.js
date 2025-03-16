import { getStoredItem } from "../../services";
import { config } from "../../../config/config";

export const getDiscordConfig = async (clanid) => {
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
  clanid,
  { botLanguaje, readClanLog, automaticKick, setNotReadyPVP, walkeralarm },
) => {
  const params = new URLSearchParams({
    languaje: botLanguaje,
    clanlog: readClanLog,
    kick: automaticKick,
    readypvp: setNotReadyPVP,
    walkeralarm: walkeralarm,
  });

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
