import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import MapSelectList from "./MapSelectList";

const CreateMapPanel = ({ maps, onCreateMap }) => {
  const { t } = useTranslation();
  const [mapNameInput, setMapNameInput] = useState("");
  const [mapDateInput, setMapDateInput] = useState(1);
  const [mapSelectInput, setMapSelectInput] = useState("Canyon");

  const handleSubmit = (evt) => {
    evt.preventDefault();
    const date = new Date();
    date.setDate(date.getDate() + Number.parseInt(mapDateInput));
    onCreateMap(
      evt,
      mapNameInput,
      date.toISOString().split("T")[0],
      mapSelectInput,
    );
    setMapNameInput("");
    setMapDateInput(1);
    setMapSelectInput("Canyon");
  };

  return (
    <div className="w-full">
      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden mb-4">
        <div className="p-4 bg-gray-900 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-gray-300">
            {t("maps.newMap")}
          </h2>
        </div>
        <div className="p-4">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="form-group">
                <label
                  htmlFor="map_name"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  {t("maps.mapName")}
                </label>
                <input
                  type="text"
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="map_name"
                  name="map_name"
                  maxLength="30"
                  value={mapNameInput}
                  onChange={(evt) => setMapNameInput(evt.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label
                  htmlFor="map_date"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  {t("maps.daysForBurning")}
                </label>
                <input
                  type="number"
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="map_date"
                  name="map_date"
                  value={mapDateInput}
                  min={1}
                  max={365}
                  onChange={(evt) => setMapDateInput(evt.target.value)}
                  required
                />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-center text-gray-300 mb-2">{t("maps.mapType")}</p>
              <div
                name="mapselect"
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2"
              >
                <MapSelectList
                  maps={maps}
                  mapSelectInput={mapSelectInput}
                  onSelectMap={setMapSelectInput}
                />
              </div>
            </div>
            <button
              className="w-full mt-4 p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              type="submit"
              value="Submit"
            >
              {t("maps.createNewMap")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateMapPanel;
