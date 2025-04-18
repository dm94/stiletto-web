"use client";
import type React from "react";
import { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import ClusterList from "./ClusterList";
import SymbolSelector from "./SymbolSelector";
import {
  updateClan,
  createClan,
  getClanInfo,
} from "../functions/requests/clans";
import type {
  CreateClanRequestParams,
  UpdateClanRequestParams,
} from "../types/dto/clan";

interface ClanConfigProps {
  clanid?: number;
  onClose?: () => void;
  onError?: (error: string) => void;
}

interface ClanFormState {
  addClanNameInput: string;
  addClanColorInput: string;
  addClanDiscordInput: string;
  clanFlagSymbolInput: string;
  regionInput: string;
  recruitInput: boolean;
}

const ClanConfig: React.FC<ClanConfigProps> = ({
  clanid,
  onClose,
  onError,
}) => {
  const { t } = useTranslation();
  const [formState, setFormState] = useState<ClanFormState>({
    addClanNameInput: "",
    addClanColorInput: "#000000",
    addClanDiscordInput: "",
    clanFlagSymbolInput: "C1",
    regionInput: "EU-Official",
    recruitInput: true,
  });

  useEffect(() => {
    const fetchClanData = async (): Promise<void> => {
      if (!clanid) {
        return;
      }

      try {
        const data = await getClanInfo(clanid);
        if (data) {
          setFormState({
            addClanNameInput: data.name,
            addClanColorInput: data.flagcolor ?? "#000000",
            addClanDiscordInput: data.invitelink ?? "",
            clanFlagSymbolInput: data.symbol ?? "",
            regionInput: data.region,
            recruitInput: data.recruitment,
          });
        }
      } catch {
        onError?.("errors.apiConnection");
      }
    };

    fetchClanData();
  }, [clanid, onError]);

  const handleCreateClan = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    try {
      const requestParams: CreateClanRequestParams = {
        clanname: formState.addClanNameInput,
        clancolor: formState.addClanColorInput,
        clandiscord: formState.addClanDiscordInput,
        symbol: formState.clanFlagSymbolInput,
        region: formState.regionInput,
        recruit: formState.recruitInput,
      };

      await createClan(requestParams);
    } catch {
      onError?.("errors.apiConnection");
    } finally {
      onClose?.();
    }
  };

  const handleUpdateClan = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    try {
      if (clanid === undefined) {
        return;
      }

      const requestParams: UpdateClanRequestParams = {
        clanname: formState.addClanNameInput,
        clancolor: formState.addClanColorInput,
        clandiscord: formState.addClanDiscordInput,
        symbol: formState.clanFlagSymbolInput,
        region: formState.regionInput,
        recruit: formState.recruitInput,
      };

      await updateClan(Number(clanid), requestParams);
      onClose?.();
    } catch {
      onClose?.();
      onError?.("errors.apiConnection");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h5 className="text-xl font-semibold text-white">
            {t("clan.configuration")}
          </h5>
          <button
            type="button"
            className="text-gray-400 hover:text-white"
            onClick={onClose}
            aria-label="Close"
            title="Close"
          >
            <span className="sr-only">Close</span>
            <svg
              aria-hidden="true"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
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
              <label
                htmlFor="clan_name"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                {t("clan.clanName")}
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                id="clan_name"
                name="clan_name"
                maxLength={20}
                value={formState.addClanNameInput}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormState({
                    ...formState,
                    addClanNameInput: e.target.value,
                  })
                }
                required
              />
            </div>
            <div>
              <label
                htmlFor="regionInput"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                {t("common.region")}
              </label>
              <ClusterList
                id="regionInput"
                value={formState.regionInput}
                onChange={(value: string) =>
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
                  {t("clan.lookingForNewMembers")}
                </label>
              </div>
            </div>
            <div>
              <label
                htmlFor="discord_invite"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                {t("clan.discordInviteLink")} {t("common.optional")}
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
                  maxLength={10}
                  value={formState.addClanDiscordInput}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormState({
                      ...formState,
                      addClanDiscordInput: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="flag_color"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                {t("clan.flagColor")} {t("common.optional")}
              </label>
              <input
                type="color"
                className="w-full h-10 bg-gray-700 border border-gray-600 rounded-md cursor-pointer"
                id="flag_color"
                value={formState.addClanColorInput}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormState({
                    ...formState,
                    addClanColorInput: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label
                htmlFor="clan_symbol"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                {t("diplomacy.symbol")}
              </label>
              <SymbolSelector
                selectedSymbol={formState.clanFlagSymbolInput}
                onChange={(symbol) =>
                  setFormState({ ...formState, clanFlagSymbolInput: symbol })
                }
              />
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={onClose}
              >
                {t("common.cancel")}
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {clanid ? t("clanConfig.update") : t("clan.createClan")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClanConfig;
