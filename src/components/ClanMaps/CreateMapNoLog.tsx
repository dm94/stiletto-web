import type React from "react";
import { useState, useEffect, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { getMapNames } from "../../functions/services";
import CreateMapPanel from "./CreateMapPanel";
import { getDomain } from "../../functions/utils";
import { createMap as createMapRequest } from "../../functions/requests/maps";
import type {
  CreateMapNoLogProps,
  MapInfo,
  MapCreationResponse,
} from "../../types/maps";

const CreateMapNoLog: React.FC<CreateMapNoLogProps> = ({ onOpen }) => {
  const { t } = useTranslation();
  const [maps, setMaps] = useState<MapInfo[] | null>(null);
  const [mapIdInput, setMapIdInput] = useState<number | string>(0);
  const [mapPassInput, setMapPassInput] = useState<string>("");
  const [showShareMap, setShowShareMap] = useState<boolean>(false);

  useEffect(() => {
    const fetchMaps = async () => {
      const maps = await getMapNames();
      setMaps(maps);
    };
    fetchMaps();
  }, []);

  const createMap = async (
    event: FormEvent,
    mapNameInput: string,
    mapDateInput: string,
    mapSelectInput: string,
  ) => {
    event.preventDefault();

    try {
      const response = (await createMapRequest(
        mapNameInput,
        mapDateInput,
        mapSelectInput,
      )) as unknown as MapCreationResponse;
      setMapIdInput(response.IdMap);
      setMapPassInput(response.PassMap);
      setShowShareMap(true);
    } catch (error) {
      console.log(error);
    }
  };

  const shareMapLink = () => (
    <input
      className="px-4 py-2 bg-green-600 text-white rounded-md w-full disabled:bg-green-400"
      type="text"
      value={`${getDomain()}/map/${mapIdInput}?pass=${mapPassInput}`}
      disabled
    />
  );

  return (
    <div className="flex gap-4 flex-col p-4">
      <div className="w-full">
        <div className="bg-white rounded shadow p-4 mb-4 dark:bg-gray-800 dark:text-white">
          <div className="text-lg font-semibold mb-2 border-b pb-2">
            {t("maps.openExistingMap")}
          </div>
          <div className="p-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="col-span-1">
                <label
                  htmlFor="map_id"
                  className="block text-sm font-medium mb-2"
                >
                  {t("maps.mapId")}
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="map_id"
                  name="map_id"
                  maxLength={4}
                  value={mapIdInput}
                  onChange={(evt) => setMapIdInput(evt.target.value)}
                  required
                />
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="map_pass"
                  className="block text-sm font-medium mb-2"
                >
                  {t("maps.mapPass")}
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="px-4 py-2 bg-green-400 hover:bg-green-500 text-white font-semibold rounded-lg w-full mt-2"
              type="button"
              onClick={() => onOpen(mapIdInput, mapPassInput)}
            >
              {t("maps.openMap")}
            </button>
          </div>
        </div>
      </div>
      <CreateMapPanel maps={maps} onCreateMap={createMap} />
      {showShareMap && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow p-4 dark:bg-gray-800 dark:text-white w-1/2">
            <div className="text-lg font-semibold mb-4 border-b pb-2">
              {t("maps.mapCreated")}
            </div>
            <div className="mb-4">{shareMapLink()}</div>
            <button
              type="button"
              className="px-4 py-2 bg-green-400 hover:bg-green-500 text-white font-semibold rounded-lg w-full"
              onClick={() => onOpen(mapIdInput, mapPassInput)}
            >
              {t("maps.openMap")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateMapNoLog;
