"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import MapSelectList from "./MapSelectList";

interface CreateMapPanelProps {
  maps: string[] | null;
  onCreateMap: (
    event: React.FormEvent,
    mapName: string,
    mapDate: string,
    mapSelect: string
  ) => void;
}

export default function CreateMapPanel({
  maps,
  onCreateMap,
}: CreateMapPanelProps) {
  const t = useTranslations();
  const [mapNameInput, setMapNameInput] = useState("");
  const [mapDateInput, setMapDateInput] = useState(1);
  const [mapSelectInput, setMapSelectInput] = useState("Canyon");

  const handleSubmit = (evt: React.FormEvent) => {
    evt.preventDefault();
    const date = new Date();
    date.setDate(date.getDate() + Number.parseInt(String(mapDateInput)));
    onCreateMap(
      evt,
      mapNameInput,
      date.toISOString().split("T")[0],
      mapSelectInput
    );
    setMapNameInput("");
    setMapDateInput(1);
    setMapSelectInput("Canyon");
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <h3 className="text-lg font-medium">{t("New Map")}</h3>
      </div>
      <div className="p-4">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="map_name"
                className="block text-sm font-medium mb-1"
              >
                {t("Map Name")}
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                id="map_name"
                name="map_name"
                maxLength={30}
                value={mapNameInput}
                onChange={(evt) => setMapNameInput(evt.target.value)}
                required
              />
            </div>
            <div>
              <label
                htmlFor="map_date"
                className="block text-sm font-medium mb-1"
              >
                {t("Days for burning")}
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                id="map_date"
                name="map_date"
                value={mapDateInput}
                min={1}
                max={365}
                onChange={(evt) => setMapDateInput(Number(evt.target.value))}
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <p className="text-center text-sm font-medium mb-2">
              {t("Map Type")}
            </p>
            <div className="grid grid-cols-1 gap-4">
              <MapSelectList
                maps={maps}
                mapSelectInput={mapSelectInput}
                onSelectMap={setMapSelectInput}
              />
            </div>
          </div>
          <button
            className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
            type="submit"
          >
            {t("Create new map")}
          </button>
        </form>
      </div>
    </div>
  );
}
