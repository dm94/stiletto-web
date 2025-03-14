'use client';

import Image from 'next/image';

interface MapData {
  idMap: string;
  name: string;
  image: string;
}

interface MapSelectListProps {
  maps: MapData[] | null;
  mapSelectInput: string;
  onSelectMap: (mapName: string) => void;
}

export default function MapSelectList({ maps, mapSelectInput, onSelectMap }: MapSelectListProps) {
  if (!maps) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {maps.map((map) => (
        <button
          type="button"
          className="p-2 text-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          key={`selectmap${map.idMap}`}
          onClick={() => onSelectMap(map.name)}
        >
          <div className="relative aspect-square w-full mb-2">
            <Image
              src={map.image}
              alt={map.name}
              fill
              className={`object-cover rounded-lg ${
                map.name === mapSelectInput
                  ? 'ring-2 ring-green-500'
                  : ''
              }`}
            />
          </div>
          <h6 className="text-sm font-medium">{map.name}</h6>
        </button>
      ))}
    </div>
  );
} 