import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const CreateResourceTab = ({
  items,
  onCreateResource,
  coordinateXInput,
  coordinateYInput,
  onChangeX,
  onChangeY,
}) => {
  const { t } = useTranslation();
  const [resourceTypeInput, setResourceTypeInput] = useState(
    items?.[0]?.name ?? "Aloe Vera"
  );
  const [qualityInput, setQualityInput] = useState(0);
  const [descriptionInput, setDescriptionInput] = useState("");
  const [lastHarvestedInput, setLastHarvestedInput] = useState("");

  const resourcesList = () => {
    if (items != null) {
      return items.map((item) => (
        <option key={item.name} value={item.name}>
          {t(item.name, { ns: "items" })}
        </option>
      ));
    }
    return false;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onCreateResource(
      resourceTypeInput,
      qualityInput,
      descriptionInput,
      lastHarvestedInput
    );
    setResourceTypeInput("Aloe Vera");
    setQualityInput(0);
    setDescriptionInput("");
    setLastHarvestedInput("");
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="resourcetype" className="block text-sm font-medium text-gray-300 mb-1">
            {t("Type")}
          </label>
          <select
            id="resourcetype"
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={resourceTypeInput}
            onChange={(evt) => setResourceTypeInput(evt.target.value)}
          >
            {resourcesList()}
          </select>
        </div>
        <div>
          <label htmlFor="coordinateXInput" className="block text-sm font-medium text-gray-300 mb-1">
            {t("Coordinate")} X ({t("Not the same as in the game")})
          </label>
          <input
            type="text"
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            name="coordinateXInput"
            value={coordinateXInput}
            onChange={(evt) => onChangeX(evt.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="coordinateYInput" className="block text-sm font-medium text-gray-300 mb-1">
            {t("Coordinate")} Y ({t("Not the same as in the game")})
          </label>
          <input
            type="text"
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            name="coordinateYInput"
            value={coordinateYInput}
            onChange={(evt) => onChangeY(evt.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="descriptionInput" className="block text-sm font-medium text-gray-300 mb-1">
            {t("Description")}
          </label>
          <input
            type="text"
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            name="descriptionInput"
            value={descriptionInput}
            onChange={(evt) => setDescriptionInput(evt.target.value)}
            maxLength="100"
          />
        </div>
        <div>
          <label htmlFor="Last Harvested" className="block text-sm font-medium text-gray-300 mb-1">
            {t("Last Harvested")}
          </label>
          <input
            type="datetime-local"
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            name="Last Harvested"
            value={lastHarvestedInput}
            onChange={(evt) => setLastHarvestedInput(evt.target.value)}
          />
        </div>
        <button
          className="w-full p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          type="submit"
          value="Submit"
        >
          {t("Create resource")}
        </button>
      </form>
    </div>
  );
};

export default CreateResourceTab;
