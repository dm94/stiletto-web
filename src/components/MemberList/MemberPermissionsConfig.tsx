import type React from "react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  getMemberPermissions,
  updateMemberPermissions,
} from "../../functions/requests/clans/members";
import type { MemberPermissions } from "../../types/dto/members";

interface MemberPermissionsConfigProps {
  clanid: number;
  memberid: string;
  onClose?: () => void;
  onError?: (error: string) => void;
}

const MemberPermissionsConfig: React.FC<MemberPermissionsConfigProps> = ({
  clanid,
  memberid,
  onClose,
  onError,
}) => {
  const { t } = useTranslation();
  const [permissions, setPermissions] = useState<MemberPermissions>({
    bot: false,
    diplomacy: false,
    kickmembers: false,
    request: false,
    walkers: false,
  });

  useEffect(() => {
    const fetchPermissions = async (): Promise<void> => {
      if (!clanid || !memberid) {
        return;
      }

      try {
        const request = await getMemberPermissions(clanid, memberid);
        setPermissions(request);
      } catch {
        onError?.("errors.apiConnection");
      }
    };

    fetchPermissions();
  }, [clanid, memberid, onError]);

  const handleUpdateMemberPermissions = async (): Promise<void> => {
    if (!clanid || !memberid) {
      return;
    }

    try {
      await updateMemberPermissions(clanid, memberid, permissions);

      onClose?.();
    } catch {
      onError?.("errors.apiConnection");
    }
  };

  const togglePermission = (key: keyof MemberPermissions): void => {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-xl max-w-md w-full mx-4">
        <div className="bg-gray-900 px-4 py-3 border-b border-gray-700 flex justify-between items-center">
          <h5 className="text-white font-medium">
            {t("discord.changePermissions")}
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
          <div className="space-y-4">
            <div
              className="flex items-center justify-start"
              title={t("discord.allowToChangeBotSettings")}
            >
              <div className="relative inline-block w-10 mr-2 align-middle select-none flex-shrink-0 flex items-center">
                <input
                  type="checkbox"
                  id="botInput"
                  checked={permissions.bot}
                  onChange={() => togglePermission("bot")}
                  className="absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer checked:right-0 checked:border-blue-500 focus:outline-none duration-200 ease-in"
                />
              </div>
              <label className="text-sm" htmlFor="botInput">
                {t("discord.discordBotSettings")}
              </label>
            </div>

            <div
              className="flex items-center justify-start"
              title={t("discord.allowEditingWalkers")}
            >
              <div className="relative inline-block w-10 mr-2 align-middle select-none flex-shrink-0 flex items-center">
                <input
                  type="checkbox"
                  id="walkersInput"
                  checked={permissions.walkers}
                  onChange={() => togglePermission("walkers")}
                  className="absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer checked:right-0 checked:border-blue-500 focus:outline-none duration-200 ease-in"
                />
              </div>
              <label className="text-sm" htmlFor="walkersInput">
                {t("discord.allowEditingWalkers")}
              </label>
            </div>

            <div
              className="flex items-center justify-start"
              title={t("discord.allowEditingDiplomacy")}
            >
              <div className="relative inline-block w-10 mr-2 align-middle select-none flex-shrink-0 flex items-center">
                <input
                  type="checkbox"
                  id="diplomacyInput"
                  checked={permissions.diplomacy}
                  onChange={() => togglePermission("diplomacy")}
                  className="absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer checked:right-0 checked:border-blue-500 focus:outline-none duration-200 ease-in"
                />
              </div>
              <label className="text-sm" htmlFor="diplomacyInput">
                {t("discord.allowEditingDiplomacy")}
              </label>
            </div>

            <div
              className="flex items-center justify-start"
              title={t("Allow management of request")}
            >
              <div className="relative inline-block w-10 mr-2 align-middle select-none flex-shrink-0 flex items-center">
                <input
                  type="checkbox"
                  id="requestInput"
                  checked={permissions.request}
                  onChange={() => togglePermission("request")}
                  className="absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer checked:right-0 checked:border-blue-500 focus:outline-none duration-200 ease-in"
                />
              </div>
              <label className="text-sm" htmlFor="requestInput">
                {t("Allow management of request")}
              </label>
            </div>

            <div
              className="flex items-center justify-start"
              title={t("discord.allowKickMembers")}
            >
              <div className="relative inline-block w-10 mr-2 align-middle select-none flex-shrink-0 flex items-center">
                <input
                  type="checkbox"
                  id="kickmembersInput"
                  checked={permissions.kickmembers}
                  onChange={() => togglePermission("kickmembers")}
                  className="absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer checked:right-0 checked:border-blue-500 focus:outline-none duration-200 ease-in"
                />
              </div>
              <label className="text-sm" htmlFor="kickmembersInput">
                {t("discord.allowKickMembers")}
              </label>
            </div>
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
            onClick={handleUpdateMemberPermissions}
          >
            {t("common.save")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemberPermissionsConfig;
