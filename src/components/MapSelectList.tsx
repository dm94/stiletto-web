'use client';

import { type GameMap } from '@/types/Map';

interface MapSelectListProps {
  maps?: GameMap[];
  mapSelectInput: string;
  onSelectMap: (mapName: string) => void;
}

export default function MapSelectList({
  maps,
  mapSelectInput,
  onSelectMap,
}: MapSelectListProps) {
  if (!maps) {
    return null;
  }

  return (
    <>
      {maps.map((map) => (
        <button
          type="button"
          className="p-2 col-sm-4 col-xl-2 text-center"
          key={`selectmap${map.idMap}`}
          onClick={() => onSelectMap(map.name)}
        >
          <img
            src={map.image}
            className={
              map.name === mapSelectInput
                ? 'img-fluid img-thumbnail'
                : 'img-fluid'
            }
            alt={map.name}
          />
          <h6>{map.name}</h6>
        </button>
      ))}
    </>
  );
} 