import type React from "react";
import { useTranslation } from "react-i18next";
import { memo, useCallback, useMemo } from "react";
import { getStoredItem } from "../../functions/services";
import { getDomain } from "../../functions/utils";
import { config } from "../../config/config";
import type { MapInfo } from "../../types/dto/maps";

interface ClanMapItemProps {
  map: MapInfo;
  value: string;
  onOpen: (map: MapInfo) => void;
  onDelete: (mapId: number) => void;
}

const ClanMapItem: React.FC<ClanMapItemProps> = ({
  map,
  value,
  onOpen,
  onDelete,
}) => {
  const { t } = useTranslation();
  const userDiscordId = useMemo(() => getStoredItem("discordid"), []);

  const handleOpenMap = useCallback(() => {
    onOpen(map);
  }, [map, onOpen]);

  const handleDeleteMap = useCallback(() => {
    onDelete(map.mapid);
  }, [map.mapid, onDelete]);

  const handleShareMap = useCallback(() => {
    window.open(`${getDomain()}/map/${map.mapid}?pass=${map.pass}`);
  }, [map.mapid, map.pass]);

  const isOwner = useMemo(
    () => map?.discordid === userDiscordId,
    [map?.discordid, userDiscordId],
  );

  const mapImageSrc = useMemo(() => {
    return `${config.RESOURCES_URL}/maps/${value?.replace("_new", "")}.jpg`;
  }, [value]);

  const renderDeleteButton = useMemo(() => {
    if (!isOwner) {
      return null;
    }

    return (
      <div className="flex flex-col space-y-2 w-full h-full">
        <button
          type="button"
          aria-label={t("maps.deleteMap")}
          className="w-full p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          onClick={handleDeleteMap}
        >
          <i className="fas fa-trash-alt mr-2" /> {t("maps.deleteMap")}
        </button>
      </div>
    );
  }, [isOwner, t, handleDeleteMap]);

  const renderShareButton = useMemo(() => {
    if (!isOwner) {
      return null;
    }

    return (
      <div className="flex flex-col space-y-2 w-full h-full">
        <button
          type="button"
          aria-label={t("maps.shareMap")}
          className="w-full p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          onClick={handleShareMap}
        >
          <i className="fas fa-share-alt mr-2" /> {t("maps.shareMap")}
        </button>
      </div>
    );
  }, [isOwner, t, handleShareMap]);

  const date = new Date();
  const dateBurning = new Date(map?.dateofburning ?? "");
  const isExpired = useMemo(() => dateBurning <= date, [dateBurning, date]);

  return (
    <div className="p-2 w-full text-center" key={`clanmap${map?.mapid}`}>
      <div className="flex">
        <button type="button" className="w-1/2 pr-0" onClick={handleOpenMap}>
          <img
            src={mapImageSrc}
            className="w-full h-auto"
            alt={map?.name}
            loading="lazy"
          />
        </button>
        <div className="w-1/2 pl-0">
          <div className="flex flex-col space-y-2 w-full h-full">
            <button
              type="button"
              aria-label={t("maps.showMap")}
              className="w-full p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={handleOpenMap}
            >
              <i className="fas fa-eye mr-2" /> {t("maps.showMap")}
            </button>
            {renderDeleteButton}
            {renderShareButton}
          </div>
        </div>
      </div>
      <h5 className="m-0">
        {map?.name}{" "}
        <small className={isExpired ? "text-red-500" : "text-green-500"}>
          {dateBurning.toISOString().split("T")[0]}
        </small>
      </h5>
      <p className="m-0 text-gray-400">{map?.discordTag ?? ""}</p>
    </div>
  );
};

export default memo(ClanMapItem);
