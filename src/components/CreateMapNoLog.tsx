"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { getMapNames } from "@/lib/services";
import { getDomain } from "@/lib/utils";
import { config } from "@/config/config";
import CreateMapPanel from "./CreateMapPanel";

interface MapItem {
  idMap: string;
  name: string;
  image: string;
}

interface CreateMapNoLogProps {
  onOpen: (mapId: string, pass: string) => void;
}

interface CreateMapResponse {
  IdMap: string;
  PassMap: string;
}

export default function CreateMapNoLog({ onOpen }: CreateMapNoLogProps) {
  const t = useTranslations();
  const [maps, setMaps] = useState<MapItem[]>([]);
  const [mapIdInput, setMapIdInput] = useState("");
  const [mapPassInput, setMapPassInput] = useState("");
  const [showShareMap, setShowShareMap] = useState(false);

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
    mapSelectInput: string
  ) => {
    event.preventDefault();

    try {
      const response = await fetch(`${config.API_URL}/maps`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: mapNameInput,
          dateofburning: mapDateInput,
          type: mapSelectInput,
        }),
      });

      const data: CreateMapResponse = await response.json();
      setMapIdInput(data.IdMap);
      setMapPassInput(data.PassMap);
      setShowShareMap(true);
    } catch (error) {
      console.error(error);
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
                  type="text"
                  className="form-control"
                  id="map_id"
                  name="map_id"
                  maxLength={4}
                  value={mapIdInput}
                  onChange={(evt) => setMapIdInput(evt.target.value)}
                  required
                />
              </div>
              <div className="col-xl-9 form-group">
                <label htmlFor="map_pass">{t("Map Pass")}</label>
                <input
                  type="text"
                  className="form-control"
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
              <h5 className="modal-title">{t("Share Map")}</h5>
            </div>
            <div className="modal-body">
              <p>{t("Copy this link to share the map")}</p>
              {shareMapLink()}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowShareMap(false)}
              >
                {t("Close")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
