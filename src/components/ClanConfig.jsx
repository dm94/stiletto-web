import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import ClusterList from "./ClusterList";
import { config } from "../config/config";
import { updateClan, createClan } from "../functions/requests/clan";
import { closeSession, getStoredItem } from "../functions/services";

const ClanConfig = ({ clanid, onClose, onError }) => {
  const { t } = useTranslation();
  const [formState, setFormState] = useState({
    addClanNameInput: "",
    addClanColorInput: "#000000",
    addClanDiscordInput: "",
    clanFlagSymbolInput: "C1",
    regionInput: "EU-Official",
    recruitInput: true,
  });

  useEffect(() => {
    const fetchClanData = async () => {
      if (!clanid) {
        return false;
      }

      try {
        const response = await fetch(
          `${config.REACT_APP_API_URL}/clans/${clanid}`,
          {
            headers: {
              Authorization: `Bearer ${getStoredItem("token")}`,
            },
          }
        );

        if (response.status === 200) {
          const data = await response.json();
          if (data) {
            setFormState({
              addClanNameInput: data.name,
              addClanColorInput: data.flagcolor,
              addClanDiscordInput: data.invitelink,
              clanFlagSymbolInput: data.symbol,
              regionInput: data.region,
              recruitInput: data.recruitment,
            });
          }
        } else if (response.status === 401) {
          closeSession();
          onError?.("You don't have access here, try to log in again");
        } else if (response.status === 503) {
          onError?.("Error connecting to database");
        }
      } catch {
        onError?.("Error when connecting to the API");
      }
    };

    fetchClanData();
  }, [clanid, onError]);

  const handleCreateClan = async (e) => {
    e.preventDefault();

    try {
      const response = await createClan({
        clanname: formState.addClanNameInput,
        clancolor: formState.addClanColorInput,
        clandiscord: formState.addClanDiscordInput,
        symbol: formState.clanFlagSymbolInput,
        region: formState.regionInput,
        recruit: formState.recruitInput,
      });

      if (response.status === 201) {
        onClose?.();
      } else if (response.status === 401) {
        onClose?.();
        closeSession();
        onError?.("You don't have access here, try to log in again");
      } else if (response.status === 503 || response.status === 205) {
        onError?.("Error connecting to database");
      }
    } catch {
      onClose?.();
      onError?.("Error when connecting to the API");
    }
  };

  const handleUpdateClan = async (e) => {
    e.preventDefault();

    try {
      const response = await updateClan(clanid, {
        clanname: formState.addClanNameInput,
        clancolor: formState.addClanColorInput,
        clandiscord: formState.addClanDiscordInput,
        symbol: formState.clanFlagSymbolInput,
        region: formState.regionInput,
        recruit: formState.recruitInput,
      });

      if (response.status === 200) {
        onClose?.();
      } else if (response.status === 401) {
        onClose?.();
        closeSession();
        onError?.("You don't have access here, try to log in again");
      } else if (response.status === 503 || response.status === 205) {
        onError?.("Error connecting to database");
      }
    } catch {
      onClose?.();
      onError?.("Error when connecting to the API");
    }
  };

  const renderSymbolsList = () => {
    const symbols = Array.from({ length: 30 }, (_, i) => `C${i + 1}`);

    return symbols.map((symbol) => (
      <button
        type="button"
        className="col-3"
        key={`symbol-${symbol}`}
        onClick={() =>
          setFormState({ ...formState, clanFlagSymbolInput: symbol })
        }
      >
        <img
          src={`${config.REACT_APP_RESOURCES_URL}/symbols/${symbol}.png`}
          className={
            symbol === formState.clanFlagSymbolInput
              ? "img-fluid img-thumbnail"
              : "img-fluid"
          }
          alt={`Clan symbol ${symbol}`}
          title={`Clan symbol ${symbol}`}
          id={`symbol-img-${symbol}`}
        />
      </button>
    ));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h5 className="text-xl font-semibold text-white">{t("Clan Configuration")}</h5>
          <button
            type="button"
            className="text-gray-400 hover:text-white"
            onClick={onClose}
            aria-label="Close"
            title="Close"
          >
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4">
          <form
            onSubmit={clanid ? handleUpdateClan : handleCreateClan}
            id="clanconfig"
            className="space-y-4"
          >
            <div>
              <label htmlFor="clan_name" className="block text-sm font-medium text-gray-300 mb-1">
                {t("Clan Name")}
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                id="clan_name"
                name="clan_name"
                maxLength="20"
                value={formState.addClanNameInput}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    addClanNameInput: e.target.value,
                  })
                }
                required
              />
            </div>
            <div>
              <label htmlFor="regionInput" className="block text-sm font-medium text-gray-300 mb-1">
                {t("Region")}
              </label>
              <ClusterList
                onError={(error) => onError?.(error)}
                value={formState.regionInput}
                onChange={(value) =>
                  setFormState({ ...formState, regionInput: value })
                }
                filter={false}
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  id="recruitmentInput"
                  checked={formState.recruitInput}
                  onChange={() =>
                    setFormState({
                      ...formState,
                      recruitInput: !formState.recruitInput,
                    })
                  }
                />
                <label
                  className="text-sm text-gray-300"
                  htmlFor="recruitmentInput"
                >
                  {t("Looking for new members?")}{" "}
                  {t(
                    "By disabling this option the clan does not appear in the clan list."
                  )}
                </label>
              </div>
            </div>
            <div>
              <label htmlFor="discord_invite" className="block text-sm font-medium text-gray-300 mb-1">
                {t("Discord Invite Link")} {t("(Optional)")}
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 py-2 rounded-l-md border border-r-0 border-gray-600 bg-gray-700 text-gray-300 text-sm">
                  https://discord.gg/
                </span>
                <input
                  type="text"
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-r-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  id="discord_invite"
                  name="discord_invite"
                  maxLength="10"
                  value={formState.addClanDiscordInput}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      addClanDiscordInput: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div>
              <label htmlFor="flag_color" className="block text-sm font-medium text-gray-300 mb-1">
                {t("Flag Color")} {t("(Optional)")}
              </label>
              <input
                type="color"
                className="w-full h-10 bg-gray-700 border border-gray-600 rounded-md cursor-pointer"
                id="flag_color"
                value={formState.addClanColorInput}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    addClanColorInput: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label htmlFor="clan_symbol" className="block text-sm font-medium text-gray-300 mb-2">
                {t("Clan Symbol")}
              </label>
              <div className="grid grid-cols-4 gap-2" id="clan_symbol">
                {renderSymbolsList()}
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={onClose}
              >
                {t("Cancel")}
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {clanid ? t("Update") : t("Create")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClanConfig;
