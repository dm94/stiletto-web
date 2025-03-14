"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import CreateMapPanel from "./CreateMapPanel";
import { getMapNames } from "@/lib/services";
import { createMap as createMapRequest } from "@/lib/requests/maps";

interface CreateMapNoLogProps {
  onOpen: (id: string, pass: string) => void;
}

export default function CreateMapNoLog({ onOpen }: CreateMapNoLogProps) {
  const t = useTranslations();
  const [maps, setMaps] = useState<string[] | null>(null);
  const [mapIdInput, setMapIdInput] = useState<string>("");
  const [mapPassInput, setMapPassInput] = useState("");
  const [showShareMap, setShowShareMap] = useState(false);

  useEffect(() => {
    const fetchMaps = async () => {
      try {
        const mapsData = await getMapNames();
        setMaps(mapsData);
      } catch (error) {
        console.error("Error fetching maps:", error);
      }
    };
    fetchMaps();
  }, []);

  const createMap = async (
    event: React.FormEvent,
    mapNameInput: string,
    mapDateInput: string,
    mapSelectInput: string
  ) => {
    event.preventDefault();

    try {
      const response = await createMapRequest(
        mapNameInput,
        mapDateInput,
        mapSelectInput
      );
      setMapIdInput(response.IdMap);
      setMapPassInput(response.PassMap);
      setShowShareMap(true);
    } catch (error) {
      console.error("Error creating map:", error);
    }
  };

  const shareMapLink = () => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    return (
      <input
        className="w-full px-4 py-2 bg-green-500 text-white rounded cursor-not-allowed"
        type="text"
        value={`${baseUrl}/map/${mapIdInput}?pass=${mapPassInput}`}
        disabled
      />
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-3">
          <h3 className="text-lg font-medium">
            {t("Open a map that has already been created")}
          </h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <label
                htmlFor="map_id"
                className="block text-sm font-medium mb-1"
              >
                {t("Map ID")}
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                id="map_id"
                name="map_id"
                maxLength={4}
                value={mapIdInput}
                onChange={(evt) => setMapIdInput(evt.target.value)}
                required
              />
            </div>
            <div className="md:col-span-2">
              <label
                htmlFor="map_pass"
                className="block text-sm font-medium mb-1"
              >
                {t("Map Pass")}
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                id="map_pass"
                name="map_pass"
                maxLength={30}
                value={mapPassInput}
                onChange={(evt) => setMapPassInput(evt.target.value)}
                required
              />
            </div>
          </div>
          <button
            className="mt-4 w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
            type="button"
            onClick={() => onOpen(mapIdInput, mapPassInput)}
          >
            {t("Open map")}
          </button>
        </div>
      </div>

      <CreateMapPanel maps={maps} onCreateMap={createMap} />

      {showShareMap && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium">{t("Map created")}</h3>
            </div>
            <div className="p-4">{shareMapLink()}</div>
            <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
                onClick={() => onOpen(mapIdInput, mapPassInput)}
              >
                {t("Open map")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
