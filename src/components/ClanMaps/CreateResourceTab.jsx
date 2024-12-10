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
    <div className="card-body">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="resourcetype">{t("Type")}</label>
          <select
            id="resourcetype"
            className="custom-select"
            value={resourceTypeInput}
            onChange={(evt) => setResourceTypeInput(evt.target.value)}
          >
            {resourcesList()}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="coordinateXInput">
            {t("Coordinate")} X ({t("Not the same as in the game")})
          </label>
          <input
            type="text"
            className="form-control"
            name="coordinateXInput"
            value={coordinateXInput}
            onChange={(evt) => onChangeX(evt.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="coordinateYInput">
            {t("Coordinate")} Y ({t("Not the same as in the game")})
          </label>
          <input
            type="text"
            className="form-control"
            name="coordinateYInput"
            value={coordinateYInput}
            onChange={(evt) => onChangeY(evt.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="descriptionInput">{t("Description")}</label>
          <input
            type="text"
            className="form-control"
            name="descriptionInput"
            value={descriptionInput}
            onChange={(evt) => setDescriptionInput(evt.target.value)}
            maxLength="100"
          />
        </div>
        <div className="form-group">
          <label htmlFor="Last Harvested">{t("Last Harvested")}</label>
          <input
            type="datetime-local"
            className="form-control"
            name="Last Harvested"
            value={lastHarvestedInput}
            onChange={(evt) => setLastHarvestedInput(evt.target.value)}
          />
        </div>
        <button
          className="btn btn-lg btn-outline-success btn-block"
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
