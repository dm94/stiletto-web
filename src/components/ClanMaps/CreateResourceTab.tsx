import type React from "react";
import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import type { Marker } from "@ctypes/dto/marker";

interface CreateResourceTabProps {
  items: Marker[];
  coordinateXInput: number;
  coordinateYInput: number;
  onCreateResource: (
    resourceType: string,
    quality: number,
    description: string,
    lastHarvested: string,
  ) => void;
  onChangeX: (x: number) => void;
  onChangeY: (y: number) => void;
}

const CreateResourceTab: React.FC<CreateResourceTabProps> = ({
  items,
  onCreateResource,
  coordinateXInput,
  coordinateYInput,
  onChangeX,
  onChangeY,
}) => {
  const { t } = useTranslation();
  const [resourceTypeInput, setResourceTypeInput] = useState<string>(
    items?.[0]?.name ?? "Aloe Vera",
  );
  const [qualityInput, setQualityInput] = useState<number>(0);
  const [descriptionInput, setDescriptionInput] = useState<string>("");
  const [lastHarvestedInput, setLastHarvestedInput] = useState<string>("");

  const resourcesList = () => {
    if (items != null) {
      return items.map((item: Marker) => (
        <option key={item.name} value={item.name}>
          {t(item.name, { ns: "items" })}
        </option>
      ));
    }
    return false;
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onCreateResource(
      resourceTypeInput,
      qualityInput,
      descriptionInput,
      lastHarvestedInput,
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
          <label
            htmlFor="resourcetype"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            {t("common.type")}
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
          <label
            htmlFor="coordinateXInput"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            {t("common.coordinate")} X ({t("maps.notSameAsGame")})
          </label>
          <input
            type="number"
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            name="coordinateXInput"
            value={coordinateXInput}
            onChange={(evt) => onChangeX(Number(evt.target.value))}
            required
          />
        </div>
        <div>
          <label
            htmlFor="coordinateYInput"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            {t("common.coordinate")} Y ({t("maps.notSameAsGame")})
          </label>
          <input
            type="number"
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            name="coordinateYInput"
            value={coordinateYInput}
            onChange={(evt) => onChangeY(Number(evt.target.value))}
            required
          />
        </div>
        <div>
          <label
            htmlFor="descriptionInput"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            {t("common.description")}
          </label>
          <input
            type="text"
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            name="descriptionInput"
            value={descriptionInput}
            onChange={(evt) => setDescriptionInput(evt.target.value)}
            maxLength={100}
          />
        </div>
        <div>
          <label
            htmlFor="Last Harvested"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            {t("resources.lastHarvested")}
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
          aria-label={t("resources.createResource")}
        >
          {t("resources.createResource")}
        </button>
      </form>
    </div>
  );
};

export default CreateResourceTab;
