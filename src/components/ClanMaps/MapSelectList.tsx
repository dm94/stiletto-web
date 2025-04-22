import type React from "react";
import { memo, useCallback, useMemo } from "react";
import type { MouseEvent } from "react";
import type { MapJsonInfo } from "@ctypes/dto/maps";

interface MapSelectListProps {
  maps: MapJsonInfo[];
  mapSelectInput: string;
  onSelectMap: (mapName: string) => void;
}

const MapSelectList: React.FC<MapSelectListProps> = ({
  maps,
  mapSelectInput,
  onSelectMap,
}) => {
  const handleMapSelect = useCallback(
    (evt: MouseEvent<HTMLButtonElement>) => {
      onSelectMap((evt.target as HTMLElement).id);
    },
    [onSelectMap],
  );

  const renderMapButtons = useMemo(() => {
    if (!maps || maps.length === 0) {
      return null;
    }

    return maps.map((map: MapJsonInfo) => (
      <button
        type="button"
        className="p-2 text-center focus:outline-none"
        key={`selectmap${map.idMap}`}
        onClick={handleMapSelect}
      >
        <img
          src={map.image}
          className={`w-full h-auto rounded-lg ${
            map.name === mapSelectInput
              ? "ring-2 ring-blue-500"
              : "hover:opacity-75"
          }`}
          alt={map.name}
          id={`${map.name}_new`}
          loading="lazy"
        />
        <h6 className="mt-1 text-sm text-gray-300">{map.name}</h6>
      </button>
    ));
  }, [maps, mapSelectInput, handleMapSelect]);

  return <>{renderMapButtons}</>;
};

export default memo(MapSelectList);
