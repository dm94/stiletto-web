import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getMaps } from "../../services";
import CreateMapPanel from "./CreateMapPanel";
import { getDomain } from "../../functions/utils";
import { createMap as createMapRequest } from "../../functions/requests/maps";

const CreateMapNoLog = ({ onOpen }) => {
  const { t } = useTranslation();
  const [maps, setMaps] = useState(null);
  const [mapIdInput, setMapIdInput] = useState(0);
  const [mapPassInput, setMapPassInput] = useState("");
  const [showShareMap, setShowShareMap] = useState(false);

  useEffect(() => {
    const fetchMaps = async () => {
      const maps = await getMaps();
      setMaps(maps);
    };
    fetchMaps();
  }, []);

  const createMap = async (
    event,
    mapNameInput,
    mapDateInput,
    mapSelectInput
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
      console.log(error);
    }
  };

  const shareMapLink = () => (
    <input
      className="btn btn-success btn-sm btn-block"
      type="text"
      value={`${getDomain()}/map/${mapIdInput}?pass=${mapPassInput}`}
      disabled
    />
  );

  const showHideClassName = showShareMap ? "modal d-block" : "modal d-none";

  return (
    <div className="row">
      <div className="col-xl-12">
        <div className="card border-secondary mb-3">
          <div className="card-header">
            {t("Open a map that has already been created")}
          </div>
          <div className="card-body text-succes">
            <div className="row">
              <div className="col-xl-3 form-group">
                <label htmlFor="map_id">{t("Map ID")}</label>
                <input
                  type="number"
                  className="form-control"
                  id="map_id"
                  name="map_id"
                  maxLength="4"
                  value={mapIdInput}
                  onChange={(evt) => setMapIdInput(evt.target.value)}
                  required
                />
              </div>
              <div className="col-xl-9 form-group">
                <label htmlFor="map_id">{t("Map Pass")}</label>
                <input
                  type="text"
                  className="form-control"
                  id="map_pass"
                  name="map_pass"
                  maxLength="30"
                  value={mapPassInput}
                  onChange={(evt) => setMapPassInput(evt.target.value)}
                  required
                />
              </div>
            </div>
            <button
              className="btn btn-lg btn-outline-success btn-block"
              type="button"
              onClick={() => onOpen(mapIdInput, mapPassInput)}
            >
              {t("Open map")}
            </button>
          </div>
        </div>
      </div>
      <CreateMapPanel maps={maps} onCreateMap={createMap} />
      <div className={showHideClassName}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{t("Map created")}</h5>
            </div>
            <div className="modal-body">{shareMapLink()}</div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-success btn-block"
                onClick={() => onOpen(mapIdInput, mapPassInput)}
              >
                {t("Open map")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateMapNoLog;
