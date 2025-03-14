"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import MapSelectList from "./MapSelectList";
import type { GameMap } from "@/types/Map";

interface CreateMapPanelProps {
  maps: GameMap[];
  onCreateMap: (
    event: React.FormEvent,
    name: string,
    date: string,
    mapType: string
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
    date.setDate(date.getDate() + Number(mapDateInput));
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
                  maxLength={30}
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
                  onChange={(evt) => setMapDateInput(Number(evt.target.value))}
                  required
                />
              </div>
            </div>
            <div className="col-xl-12 col-sm-12 form-group">
              <p className="text-center">{t("Map Type")}</p>
              <div className="row">
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
            >
              {t("Create new map")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
