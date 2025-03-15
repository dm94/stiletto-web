import React from "react";
import { useTranslation } from "react-i18next";
import { getStoredItem } from "../../functions/services";
import { getDomain } from "../../functions/utils";
import { config } from "../../config/config";

const ClanMapItem = ({ map, value, onOpen, onDelete }) => {
  const { t } = useTranslation();

  const showButton = () => (
    <div className="flex flex-col space-y-2 w-full h-full">
      <button
        type="button"
        className="w-full p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={() => onOpen(map)}
      >
        <i className="fas fa-eye mr-2" /> {t("Show map")}
      </button>
      {deleteMapButton()}
      {shareMapButton()}
    </div>
  );

  const deleteMapButton = () => {
    if (map?.discordid === getStoredItem("discordid")) {
      return (
        <button
          type="button"
          className="w-full p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          onClick={() => onDelete(map.mapid)}
        >
          <i className="fas fa-trash-alt mr-2" /> {t("Delete map")}
        </button>
      );
    }
    return false;
  };

  const shareMapButton = () => {
    if (map?.discordid === getStoredItem("discordid")) {
      return (
        <button
          type="button"
          className="w-full p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          onClick={() =>
            window.open(`${getDomain()}/map/${map.mapid}?pass=${map.pass}`)
          }
        >
          <i className="fas fa-share-alt mr-2" /> {t("Share map")}
        </button>
      );
    }
    return false;
  };

  const date = new Date();
  const dateBurning = new Date(map?.dateofburning);

  return (
    <div
      className="p-2 w-full text-center"
      key={`clanmap${map?.mapid}`}
    >
      <div className="flex">
        <button
          type="button"
          className="w-1/2 pr-0"
          onClick={() => onOpen(map)}
        >
          <img
            src={`${config.REACT_APP_RESOURCES_URL}/maps/${value?.replace(
              "_new",
              "",
            )}.jpg`}
            className="w-full h-auto"
            alt={map?.name}
          />
        </button>
        <div className="w-1/2 pl-0">{showButton()}</div>
      </div>
      <h5 className="m-0">
        {map?.name}{" "}
        <small
          className={dateBurning <= date ? "text-red-500" : "text-green-500"}
        >
          {dateBurning.toISOString().split("T")[0]}
        </small>
      </h5>
      <p className="m-0 text-gray-400">{map?.discordTag ?? ""}</p>
    </div>
  );
};

export default ClanMapItem;
