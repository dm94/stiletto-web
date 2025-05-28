import type React from "react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  getDiscordConfig,
  updateBotConfig,
} from "@functions/requests/clans/discordbot";
import {
  Languages,
  type UpdateBotConfigParams,
  type DiscordConfig as DiscordConfigType,
} from "@ctypes/dto/discordConfig";

interface DiscordConfigProps {
  clanid: number;
  onClose: () => void;
  onError: (error: string) => void;
}

const DiscordConfig: React.FC<DiscordConfigProps> = ({
  clanid,
  onClose,
  onError,
}) => {
  const { t } = useTranslation();
  const [botConfig, setBotConfig] = useState<DiscordConfigType>({
    discordid: "",
    readClanLog: true,
    botLanguaje: Languages.EN,
    automaticKick: false,
    setNotReadyPVP: false,
    walkerAlarm: false,
  });

  useEffect(() => {
    const fetchBotConfig = async (): Promise<void> => {
      try {
        const response = await getDiscordConfig(clanid);
        if (response) {
          setBotConfig(response);
        }
      } catch {
        onError("error.databaseConnection");
      }
    };

    fetchBotConfig();
  }, [clanid, onError]);

  const handleUpdateBotConfig = async (): Promise<void> => {
    try {
      const params: UpdateBotConfigParams = {
        languaje: botConfig.botLanguaje,
        clanlog: botConfig.readClanLog,
        kick: botConfig.automaticKick,
        readypvp: botConfig.setNotReadyPVP,
        walkeralarm: botConfig.walkerAlarm,
      };

      await updateBotConfig(clanid, params);
      onClose();
    } catch {
      onError("errors.apiConnection");
    }
  };

  const handleBotLanguageChange = (
    evt: React.ChangeEvent<HTMLSelectElement>,
  ): void => {
    setBotConfig({
      ...botConfig,
      botLanguaje: evt.target.value as unknown as Languages,
    });
  };

  const toggleConfigOption = (key: keyof DiscordConfigType): void => {
    setBotConfig({ ...botConfig, [key]: !botConfig[key] });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-xl max-w-md w-full mx-4">
        <div className="bg-gray-900 px-4 py-3 border-b border-gray-700 flex justify-between items-center">
          <h5 className="text-white font-medium">
            {t("discord.discordBotConfiguration")}
          </h5>
          <button
            type="button"
            className="text-gray-400 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-full w-8 h-8 flex items-center justify-center transition-colors duration-200"
            aria-label="Close"
            onClick={onClose}
          >
            <span
              aria-hidden="true"
              className="text-lg font-bold leading-none"
              style={{ marginTop: "-1px" }}
            >
              ×
            </span>
          </button>
        </div>
        <div className="p-4 text-gray-300">
          <div className="mb-4">
            <label
              htmlFor="botlanguaje"
              className="block mb-2 text-sm font-medium"
            >
              {t("discord.botLanguage")}
            </label>
            <select
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={botConfig.botLanguaje}
              id="botlanguaje"
              onChange={handleBotLanguageChange}
            >
              <option value="en">{t("languages.english")}</option>
              <option value="es">{t("languages.spanish")}</option>
              <option value="ru">{t("languages.russian")}</option>
              <option value="fr">{t("languages.french")}</option>
              <option value="de">{t("languages.german")}</option>
            </select>
          </div>

          <div
            className="mb-3 flex items-center"
            title={t("discord.readDiscordClanLogNotice")}
          >
            <div className="relative inline-block w-10 mr-2 align-middle select-none flex-shrink-0 flex items-center">
              <input
                type="checkbox"
                id="readClanLog"
                checked={botConfig.readClanLog}
                onChange={() => toggleConfigOption("readClanLog")}
                className="absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer checked:right-0 checked:border-blue-500 focus:outline-none duration-200 ease-in"
              />
            </div>
            <label className="text-sm" htmlFor="readClanLog">
              {t("discord.readDiscordClanLog")}
            </label>
          </div>

          <div
            className="mb-3 flex items-center"
            title={t("discord.readClanLogAndKick")}
          >
            <div className="relative inline-block w-10 mr-2 align-middle select-none flex-shrink-0 flex items-center">
              <input
                type="checkbox"
                id="automaticKick"
                checked={botConfig.automaticKick}
                onChange={() => toggleConfigOption("automaticKick")}
                className="absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer checked:right-0 checked:border-blue-500 focus:outline-none duration-200 ease-in"
              />
            </div>
            <label className="text-sm" htmlFor="automaticKick">
              {t("discord.automaticKickMembersFromClan")}
            </label>
          </div>

          <div className="mb-3 flex items-center">
            <div className="relative inline-block w-10 mr-2 align-middle select-none flex-shrink-0 flex items-center">
              <input
                type="checkbox"
                id="setNotReadyPVP"
                checked={botConfig.setNotReadyPVP}
                onChange={() => toggleConfigOption("setNotReadyPVP")}
                className="absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer checked:right-0 checked:border-blue-500 focus:outline-none duration-200 ease-in"
              />
            </div>
            <label className="text-sm" htmlFor="setNotReadyPVP">
              {t("discord.pvpMarkNotReady")}
            </label>
          </div>

          <div
            className="mb-3 flex items-center"
            title={t("discord.readClanLogAndKick")}
          >
            <div className="relative inline-block w-10 mr-2 align-middle select-none flex-shrink-0 flex items-center">
              <input
                type="checkbox"
                id="walkerAlarm"
                checked={botConfig.walkerAlarm}
                onChange={() => toggleConfigOption("walkerAlarm")}
                className="absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer checked:right-0 checked:border-blue-500 focus:outline-none duration-200 ease-in"
              />
            </div>
            <label className="text-sm" htmlFor="walkerAlarm">
              {t("discord.warnIfSomeoneBringsOutWalker")}
            </label>
          </div>
        </div>
        <div className="p-4 bg-gray-900 border-t border-gray-700 flex justify-end space-x-2">
          <button
            type="button"
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            onClick={onClose}
          >
            {t("common.close")}
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={handleUpdateBotConfig}
          >
            {t("common.save")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiscordConfig;
