import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { updateMemberPermissions } from "../../functions/requests/clans/members";
import { closeSession, getUserPermssions } from "../../functions/services";

const MemberPermissionsConfig = ({ clanid, memberid, onClose, onError }) => {
  const { t } = useTranslation();
  const [permissions, setPermissions] = useState({
    bot: false,
    diplomacy: false,
    kickmembers: false,
    request: false,
    walkers: false,
  });

  useEffect(() => {
    const fetchPermissions = async () => {
      if (!clanid || !memberid) {
        return false;
      }

      const request = await getUserPermssions(clanid, memberid);
      if (request?.success) {
        const allPermissions = request.message;
        setPermissions({
          bot: allPermissions.bot === "1",
          diplomacy: allPermissions.diplomacy === "1",
          kickmembers: allPermissions.kickmembers === "1",
          request: allPermissions.request === "1",
          walkers: allPermissions.walkers === "1",
        });
      } else if (request) {
        onError?.(request.message);
      }
    };

    fetchPermissions();
  }, [clanid, memberid, onError]);

  const handleUpdateMemberPermissions = async () => {
    if (!clanid || !memberid) {
      return false;
    }

    try {
      const response = await updateMemberPermissions(
        clanid,
        memberid,
        permissions,
      );

      if (response.status === 200) {
        onClose?.();
      } else if (response.status === 401) {
        closeSession();
        onError?.("You don't have access here, try to log in again");
        onClose?.();
      } else if (response.status === 503) {
        onError?.("Error connecting to database");
        onClose?.();
      }
    } catch {
      onError?.("Error when connecting to the API");
    }
  };

  const togglePermission = (key) => {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-xl max-w-md w-full mx-4">
        <div className="bg-gray-900 px-4 py-3 border-b border-gray-700 flex justify-between items-center">
          <h5 className="text-white font-medium">{t("Change Permissions")}</h5>
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
              className="flex items-center"
              title={t("Allow to change bot settings")}
            >
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="botInput"
                  checked={permissions.bot}
                  onChange={() => togglePermission("bot")}
                  className="absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer checked:right-0 checked:border-blue-500 focus:outline-none duration-200 ease-in"
                />
                <label
                  htmlFor="botInput"
                  className="block h-6 overflow-hidden bg-gray-600 rounded-full cursor-pointer"
                />
              </div>
              <label className="text-sm" htmlFor="botInput">
                {t("Discord Bot settings")}
              </label>
            </div>

            <div
              className="flex items-center"
              title={t("Allow editing walkers")}
            >
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="walkersInput"
                  checked={permissions.walkers}
                  onChange={() => togglePermission("walkers")}
                  className="absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer checked:right-0 checked:border-blue-500 focus:outline-none duration-200 ease-in"
                />
                <label
                  htmlFor="walkersInput"
                  className="block h-6 overflow-hidden bg-gray-600 rounded-full cursor-pointer"
                />
              </div>
              <label className="text-sm" htmlFor="walkersInput">
                {t("Allow editing walkers")}
              </label>
            </div>

            <div
              className="flex items-center"
              title={t("Allow editing diplomacy")}
            >
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="diplomacyInput"
                  checked={permissions.diplomacy}
                  onChange={() => togglePermission("diplomacy")}
                  className="absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer checked:right-0 checked:border-blue-500 focus:outline-none duration-200 ease-in"
                />
                <label
                  htmlFor="diplomacyInput"
                  className="block h-6 overflow-hidden bg-gray-600 rounded-full cursor-pointer"
                />
              </div>
              <label className="text-sm" htmlFor="diplomacyInput">
                {t("Allow editing diplomacy")}
              </label>
            </div>

            <div
              className="flex items-center"
              title={t("Allow management of request")}
            >
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="requestInput"
                  checked={permissions.request}
                  onChange={() => togglePermission("request")}
                  className="absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer checked:right-0 checked:border-blue-500 focus:outline-none duration-200 ease-in"
                />
                <label
                  htmlFor="requestInput"
                  className="block h-6 overflow-hidden bg-gray-600 rounded-full cursor-pointer"
                />
              </div>
              <label className="text-sm" htmlFor="requestInput">
                {t("Allow management of request")}
              </label>
            </div>

            <div className="flex items-center" title={t("Allow kick members")}>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="kickmembersInput"
                  checked={permissions.kickmembers}
                  onChange={() => togglePermission("kickmembers")}
                  className="absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer checked:right-0 checked:border-blue-500 focus:outline-none duration-200 ease-in"
                />
                <label
                  htmlFor="kickmembersInput"
                  className="block h-6 overflow-hidden bg-gray-600 rounded-full cursor-pointer"
                />
              </div>
              <label className="text-sm" htmlFor="kickmembersInput">
                {t("Allow kick members")}
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
            {t("Close")}
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={handleUpdateMemberPermissions}
          >
            {t("Save")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemberPermissionsConfig;
