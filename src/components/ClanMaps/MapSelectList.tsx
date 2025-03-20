import type React from "react";
import type { MouseEvent } from "react";
import type { MapInfo } from "../../types/maps";

interface MapSelectListProps {
  maps: MapInfo[] | null;
  mapSelectInput: string;
  onSelectMap: (mapName: string) => void;
}

const MapSelectList: React.FC<MapSelectListProps> = ({
  maps,
  mapSelectInput,
  onSelectMap,
}) => {
  if (maps) {
    return maps.map((map: MapInfo) => (
      <button
        type="button"
        className="p-2 text-center focus:outline-none"
        key={`selectmap${map.idMap}`}
        onClick={(evt: MouseEvent<HTMLButtonElement>) =>
          onSelectMap((evt.target as HTMLElement).id)
        }
      >
        <img
          src={map.image}
          className={`w-full h-auto rounded-lg ${
            map.name === mapSelectInput
              ? "ring-2 ring-blue-500"
              : "hover:opacity-75"
          }`}
          alt={map.name}
          id={map.name}
        />
        <h6 className="mt-1 text-sm text-gray-300">{map.name}</h6>
      </button>
    ));
  }
  return "";
};

export default MapSelectList;
