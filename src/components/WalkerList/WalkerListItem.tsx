import type React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Icon from "../Icon";

interface WalkerListItemProps {
  walker: {
    walkerID: string;
    ownerUser: string;
    lastUser: string;
    datelastuse: string;
    walker_use: string;
    type: string;
    description: string;
    isReady: boolean;
    name: string;
  };
  isLeader: boolean;
  nickname: string;
  memberList: Array<{
    discordid: string;
    nickname: string;
    discordtag: string;
  }>;
  walkerListTypes: string[];
  onSave: (walker: any) => void;
  onRemove: (walkerID: string) => void;
}

const WalkerListItem: React.FC<WalkerListItemProps> = ({
  walker,
  isLeader,
  nickname,
  memberList,
  walkerListTypes,
  onSave,
  onRemove,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [walkerState, setWalkerState] = useState(walker);
  const canEdit =
    isLeader || walker.ownerUser === nickname || walker.lastUser === nickname;

  const handleWalkerUpdate = (field: string, value: any) => {
    setWalkerState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const renderWalkerInfo = () => {
    if (!isOpen) {
      return false;
    }

    return (
      <tr>
        <td colSpan={6} className="px-6 py-4 bg-gray-900">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div>
              <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
                <div className="p-4">
                  <div className="flex flex-col space-y-2">
                    <label
                      htmlFor="walkerID"
                      className="block text-sm font-medium text-gray-300"
                    >
                      {t("walkers.walkerId")}
                    </label>
                    <input
                      id="walkerID"
                      type="text"
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={walker.walkerID}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
                <div className="p-4">
                  <div className="flex flex-col space-y-2">
                    <label
                      htmlFor="lastUser"
                      className="block text-sm font-medium text-gray-300"
                    >
                      {t("walkers.lastUser")}
                    </label>
                    <input
                      id="lastUser"
                      type="text"
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={walker.lastUser}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
                <div className="p-4">
                  <div className="flex flex-col space-y-2">
                    <label
                      htmlFor="lastUse"
                      className="block text-sm font-medium text-gray-300"
                    >
                      {t("walkers.lastUse")}
                    </label>
                    <input
                      id="lastUse"
                      type="text"
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={walker.datelastuse}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
                <div className="p-4">
                  <div className="flex flex-col space-y-2">
                    <label
                      htmlFor="inputOwner"
                      className="block text-sm font-medium text-gray-300"
                    >
                      {t("common.owner")}
                    </label>
                    <select
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      id="inputOwner"
                      value={walkerState.ownerUser || ""}
                      onChange={(e) =>
                        handleWalkerUpdate("ownerUser", e.target.value)
                      }
                      disabled={!canEdit}
                    >
                      <option value="clan">{t("common.clan")}</option>
                      {memberList?.map((member) => (
                        <option key={member.discordid} value={member.nickname}>
                          {member.nickname || member.discordtag}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
                <div className="p-4">
                  <div className="flex flex-col space-y-2">
                    <label
                      htmlFor="inputUse"
                      className="block text-sm font-medium text-gray-300"
                    >
                      {t("common.use")}
                    </label>
                    <select
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      id="inputUse"
                      value={walkerState.walker_use || "None"}
                      onChange={(e) =>
                        handleWalkerUpdate("walker_use", e.target.value)
                      }
                      disabled={!canEdit}
                    >
                      {["None", "Personal", "PVP", "RAM", "Farming"].map(
                        (use) => (
                          <option key={use} value={use}>
                            {t(use)}
                          </option>
                        ),
                      )}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
                <div className="p-4">
                  <div className="flex flex-col space-y-2">
                    <label
                      htmlFor="inputType"
                      className="block text-sm font-medium text-gray-300"
                    >
                      {t("common.type")}
                    </label>
                    <select
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      id="inputType"
                      value={walkerState.type || ""}
                      onChange={(e) =>
                        handleWalkerUpdate("type", e.target.value)
                      }
                      disabled={!canEdit}
                    >
                      <option value="" />
                      {walkerListTypes.map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-3">
              <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
                <div className="p-4">
                  <div className="flex flex-col space-y-2">
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-300"
                    >
                      {t("common.description")}
                    </label>
                    <textarea
                      id="description"
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={walkerState.description || ""}
                      onChange={(e) =>
                        handleWalkerUpdate("description", e.target.value)
                      }
                      maxLength={200}
                      disabled={!canEdit}
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-3">
              <div className="flex flex-col space-y-4 items-center mt-3">
                <div className="flex space-x-2">
                  <button
                    type="button"
                    className={`p-2 rounded-l-lg focus:outline-none ${
                      walkerState.isReady
                        ? "bg-green-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-green-600 hover:text-white"
                    }`}
                    onClick={() => handleWalkerUpdate("isReady", true)}
                  >
                    <i className="fas fa-check" />
                  </button>
                  <span className="p-2 bg-gray-700 text-gray-300">
                    {t("common.isReady")}
                  </span>
                  <button
                    type="button"
                    className={`p-2 rounded-r-lg focus:outline-none ${
                      !walkerState.isReady
                        ? "bg-red-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-red-600 hover:text-white"
                    }`}
                    onClick={() => handleWalkerUpdate("isReady", false)}
                  >
                    <i className="fas fa-times" />
                  </button>
                </div>

                <button
                  type="button"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 w-full max-w-xs"
                  onClick={() => {
                    onSave(walkerState);
                    setIsOpen(false);
                  }}
                >
                  <i className="fas fa-save mr-2" /> {t("common.save")}
                </button>

                {canEdit && (
                  <button
                    type="button"
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 w-full max-w-xs"
                    onClick={() => onRemove(walker.walkerID)}
                  >
                    <i className="fas fa-trash-alt mr-2" /> {t("common.delete")}
                  </button>
                )}
              </div>
            </div>
          </div>
        </td>
      </tr>
    );
  };

  if (!walker.walkerID) {
    return "";
  }

  return (
    <>
      <tr className="hover:bg-gray-700">
        <td className="px-6 py-4 text-center whitespace-nowrap">
          {walker.type && (
            <Icon
              key={`${walker.type} Walker`}
              name={`${walker.type} Walker`}
              width="30"
            />
          )}
        </td>
        <td className="px-6 py-4 text-center whitespace-nowrap text-gray-300">
          {walker.name}
        </td>
        <td className="hidden sm:table-cell px-6 py-4 text-center whitespace-nowrap text-gray-300">
          {walker.walker_use || t("common.notDefined1")}
        </td>
        <td className="hidden sm:table-cell px-6 py-4 text-center text-gray-300">
          {walker.description}
        </td>
        <td className="px-6 py-4 text-center whitespace-nowrap">
          <i
            className={`fas fa-${
              walker.isReady ? "check text-green-500" : "times text-red-500"
            }`}
          />
        </td>
        <td className="px-6 py-4 text-center whitespace-nowrap">
          <button
            className="text-blue-400 hover:text-blue-300 focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            aria-label={
              isOpen ? t("common.hideDetails") : t("common.showDetails")
            }
          >
            <i className={`fas fa-eye${isOpen ? "-slash" : ""}`} />
          </button>
        </td>
      </tr>
      {renderWalkerInfo()}
    </>
  );
};

export default WalkerListItem;
