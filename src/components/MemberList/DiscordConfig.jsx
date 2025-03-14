import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  getDiscordConfig,
  updateBotConfig,
} from "../../functions/requests/clans/discordbot";
import { closeSession } from "../../functions/services";

const DiscordConfig = ({ clanid, onClose, onError }) => {
  const { t } = useTranslation();
  const [botConfig, setBotConfig] = useState({
    readClanLog: true,
    botLanguaje: "en",
    automaticKick: false,
    setNotReadyPVP: false,
    walkeralarm: false,
  });

  useEffect(() => {
    const fetchBotConfig = async () => {
      try {
        const response = await getDiscordConfig(clanid);

        if (response.status === 200) {
          const data = await response.json();
          if (data) {
            setBotConfig({
              botLanguaje: data.botlanguaje || "en",
              readClanLog: data.readclanlog === "1",
              automaticKick: data.automatickick === "1",
              setNotReadyPVP: data.setnotreadypvp === "1",
              walkeralarm: data.walkeralarm === "1",
            });
          }
        } else if (response.status === 401) {
          closeSession();
          onError("You don't have access here, try to log in again");
        } else if (response.status === 503) {
          onError("Error connecting to database");
        }
      } catch {
        onError("Your clan does not have a linked discord");
      }
    };

    fetchBotConfig();
  }, [clanid, onError]);

  const handleUpdateBotConfig = async () => {
    try {
      const response = await updateBotConfig(clanid, botConfig);

      if (response.status === 200) {
        onClose();
      } else if (response.status === 401) {
        closeSession();
        onError("You don't have access here, try to log in again");
        onClose();
      } else if (response.status === 503) {
        onError("Error connecting to database");
        onClose();
      }
    } catch {
      onError("Error when connecting to the API");
    }
  };

  const handleBotLanguageChange = (evt) => {
    setBotConfig({ ...botConfig, botLanguaje: evt.target.value });
  };

  const toggleConfigOption = (key) => {
    setBotConfig({ ...botConfig, [key]: !botConfig[key] });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-xl max-w-md w-full mx-4">
        <div className="bg-gray-900 px-4 py-3 border-b border-gray-700 flex justify-between items-center">
          <h5 className="text-white font-medium">{t("Discord Bot Configuration")}</h5>
          <button
            type="button"
            className="text-gray-400 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-full w-8 h-8 flex items-center justify-center transition-colors duration-200"
            aria-label="Close"
            onClick={onClose}
          >
            <span aria-hidden="true" className="text-lg font-bold leading-none" style={{ marginTop: '-1px' }}>×</span>
          </button>
        </div>
        <div className="p-4 text-gray-300">
          <div className="mb-4">
            <label htmlFor="botlanguaje" className="block mb-2 text-sm font-medium">
              {t("Bot language")}
            </label>
            <select
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={botConfig.botLanguaje}
              id="botlanguaje"
              onChange={handleBotLanguageChange}
            >
              <option value="en">{t("English")}</option>
              <option value="es">{t("Spanish")}</option>
              <option value="ru">{t("Russian")}</option>
              <option value="fr">{t("French")}</option>
              <option value="de">{t("German")}</option>
            </select>
          </div>
          
          <div className="mb-3 flex items-center"
            title={t(
              "If you want the bot to read the clan log, it is necessary for other functions."
            )}
          >
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input
                type="checkbox"
                id="readClanLog"
                checked={botConfig.readClanLog}
                onChange={() => toggleConfigOption("readClanLog")}
                className="absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer checked:right-0 checked:border-blue-500 focus:outline-none duration-200 ease-in"
              />
              <label
                htmlFor="readClanLog"
                className="block h-6 overflow-hidden bg-gray-600 rounded-full cursor-pointer"
              />
            </div>
            <label className="text-sm" htmlFor="readClanLog">
              {t("Read discord clan log.")}
            </label>
          </div>
          
          <div className="mb-3 flex items-center"
            title={t(
              "Read the clan log and if a member was kicked, kick from here too."
            )}
          >
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input
                type="checkbox"
                id="automaticKick"
                checked={botConfig.automaticKick}
                onChange={() => toggleConfigOption("automaticKick")}
                className="absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer checked:right-0 checked:border-blue-500 focus:outline-none duration-200 ease-in"
              />
              <label
                htmlFor="automaticKick"
                className="block h-6 overflow-hidden bg-gray-600 rounded-full cursor-pointer"
              />
            </div>
            <label className="text-sm" htmlFor="automaticKick">
              {t("Automatic kick members from the clan")}
            </label>
          </div>
          
          <div className="mb-3 flex items-center">
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input
                type="checkbox"
                id="setNotReadyPVP"
                checked={botConfig.setNotReadyPVP}
                onChange={() => toggleConfigOption("setNotReadyPVP")}
                className="absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer checked:right-0 checked:border-blue-500 focus:outline-none duration-200 ease-in"
              />
              <label
                htmlFor="setNotReadyPVP"
                className="block h-6 overflow-hidden bg-gray-600 rounded-full cursor-pointer"
              />
            </div>
            <label className="text-sm" htmlFor="setNotReadyPVP">
              {t(
                "Automatically if a PVP walker is used it is marked as not ready."
              )}
            </label>
          </div>
          
          <div className="mb-3 flex items-center"
            title={t(
              "Read the clan log and if a member was kicked, kick from here too."
            )}
          >
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input
                type="checkbox"
                id="walkerAlarm"
                checked={botConfig.walkeralarm}
                onChange={() => toggleConfigOption("walkeralarm")}
                className="absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer checked:right-0 checked:border-blue-500 focus:outline-none duration-200 ease-in"
              />
              <label
                htmlFor="walkerAlarm"
                className="block h-6 overflow-hidden bg-gray-600 rounded-full cursor-pointer"
              />
            </div>
            <label className="text-sm" htmlFor="walkerAlarm">
              {t("Warns if someone brings out a walker they don't own.")}
            </label>
          </div>
        </div>
        <div className="p-4 bg-gray-900 border-t border-gray-700 flex justify-end space-x-2">
          <button
            type="button"
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            onClick={onClose}
          >
            {t("Close")}
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={handleUpdateBotConfig}
          >
            {t("Save")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiscordConfig;
