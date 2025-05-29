import type React from "react";
import { useCallback, memo } from "react";
import { useTranslation } from "react-i18next";
import Icon from "../Icon";
import type { ResourceInfo } from "@ctypes/dto/resources";

interface ResourcePopupProps {
  resource: ResourceInfo;
  poachingHutRadius: number;
  updateResource?: (
    mapId: number,
    resourceId: number,
    token: string,
    date: string,
  ) => void;
  deleteResource?: (resourceId: number, resourceToken: string) => void;
  setPoachingHutRadius: (radius: number) => void;
}

const ResourcePopup: React.FC<ResourcePopupProps> = ({
  resource,
  poachingHutRadius,
  updateResource,
  deleteResource,
  setPoachingHutRadius,
}) => {
  const { t } = useTranslation();

  const handleDeleteResource = useCallback(() => {
    deleteResource?.(resource.resourceid, resource?.token ?? "");
  }, [deleteResource, resource]);

  const handlePoachingRadiusChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPoachingHutRadius(Number(e.target.value));
    },
    [setPoachingHutRadius],
  );

  const getResourceEstimatedQuality = useCallback(() => {
    const quality = 4;
    const diff = Math.abs(
      new Date().getTime() - new Date(resource.lastharvested ?? "").getTime(),
    );
    const minutes = Math.floor(diff / 1000 / 60);
    const estimatedQuality = (minutes - 45) / 10;
    const remainingQuality = quality - estimatedQuality;

    const now = new Date();
    const date = `${now.getFullYear()}-${
      now.getMonth() + 1
    }-${now.getDate()} ${now.getHours()}:${now.getMinutes()}`;

    const lastHarvestedDate = new Date(resource.lastharvested ?? "");
    const lastHarvestedDateFormatted = `${lastHarvestedDate.toLocaleDateString()} ${lastHarvestedDate.toLocaleTimeString()}`;

    return (
      <div className="resource-quality-info bg-gray-800/30 p-3 rounded-md shadow-inner">
        <button
          type="button"
          className="w-full p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3 font-medium transition-all duration-200 transform hover:translate-y-[-1px] shadow-md"
          onClick={() =>
            updateResource?.(
              resource.mapid,
              resource.resourceid,
              resource.token ?? "",
              date,
            )
          }
        >
          {t("resources.harvestedNow")}
        </button>
        <div className="mb-2 text-gray-300 flex justify-between items-center">
          <span>{t("resources.lastHarvested")}:</span>{" "}
          <span className="font-medium">{lastHarvestedDateFormatted}</span>
        </div>
        <div className="mb-2 text-gray-300 flex justify-between items-center">
          <span>{t("Spawns in")}:</span>
          <span className="font-medium text-green-400">
            {remainingQuality > 0
              ? `${Math.max(0, remainingQuality * 10)} ${t("common.minutes")}`
              : t("common.now")}
          </span>
        </div>
      </div>
    );
  }, [resource, t, updateResource]);

  const isPoachingHut =
    resource.resourcetype === "Poaching Hut" ||
    resource.resourcetype === "Enemy Poaching Hut";

  return (
    <div className="resource-popup p-4 bg-gray-900 rounded-lg shadow-lg border border-gray-700 max-w-sm">
      <div className="resource-header flex items-center gap-3 mb-3 pb-3 border-b border-gray-600">
        <Icon name={resource.resourcetype} />
        <span className="text-xl font-semibold text-white">
          {t(resource.resourcetype)}
        </span>
      </div>

      <div className="resource-coordinates mb-3 px-3 py-1.5 bg-gray-800 rounded-md text-gray-300 inline-block text-sm font-mono shadow-inner">
        [{`${Math.floor(resource.x)},${Math.floor(resource.y)}`}]
      </div>

      {resource.description && (
        <div className="resource-description mb-4 p-2 bg-gray-800/50 rounded-md text-gray-200 italic border-l-2 border-blue-500">
          {resource.description}
        </div>
      )}

      {resource.lastharvested && (
        <div className="resource-harvest-info mb-3">
          {getResourceEstimatedQuality()}
        </div>
      )}

      <div className="resource-actions flex flex-col gap-2">
        {resource.token && (
          <button
            type="button"
            className="w-full p-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 transform hover:translate-y-[-1px] font-medium shadow-md"
            onClick={handleDeleteResource}
            aria-label={`${t("common.delete")} ${t(resource.resourcetype)} ${t("common.at")} ${Math.floor(resource.x)},${Math.floor(resource.y)}`}
          >
            {t("common.delete")}
          </button>
        )}

        {isPoachingHut && (
          <div className="poaching-radius-control border-t border-yellow-500/70 mt-3 pt-3 bg-gray-800/30 p-3 rounded-md shadow-inner">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-300">
                {t("map.range")}:
              </span>
              <span className="text-sm font-bold text-yellow-400">
                {poachingHutRadius * 100}m
              </span>
            </div>
            <input
              className="w-full accent-blue-500 h-2 rounded-lg appearance-none cursor-pointer bg-gray-700 mt-1"
              id="formPoachingRadius"
              value={poachingHutRadius}
              onChange={handlePoachingRadiusChange}
              type="range"
              min="0"
              max="250"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(ResourcePopup);
