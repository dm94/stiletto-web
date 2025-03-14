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
      mapSelectInput
    );
    setMapNameInput("");
    setMapDateInput(1);
    setMapSelectInput("Canyon");
  };

  return (
    <div className="col-xl-12">
      <div className="card border-secondary mb-3">
        <div className="card-header">{t("New Map")}</div>
        <div className="card-body text-succes">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-xl-6 col-sm-12 form-group">
                <label htmlFor="map_name">{t("Map Name")}</label>
                <input
                  type="text"
                  className="form-control"
                  id="map_name"
                  name="map_name"
                  maxLength="30"
                  value={mapNameInput}
                  onChange={(evt) => setMapNameInput(evt.target.value)}
                  required
                />
              </div>
              <div className="col-xl-6 col-sm-12 form-group">
                <label htmlFor="map_date">{t("Days for burning")}</label>
                <input
                  type="number"
                  className="form-control"
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
            <div className="col-xl-12 col-sm-12 form-group">
              <p className="text-center">{t("Map Type")}</p>
              <div name="mapselect" className="row">
                <MapSelectList
                  maps={maps}
                  mapSelectInput={mapSelectInput}
                  onSelectMap={setMapSelectInput}
                />
              </div>
            </div>
            <button
              className="btn btn-lg btn-outline-success btn-block"
              type="submit"
              value="Submit"
            >
              {t("Create new map")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateMapPanel;
