"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import type { Marker } from "@/types/Marker";

interface CreateResourceTabProps {
  items: Marker[];
  coordinateX: number;
  coordinateY: number;
  onCreateResource: (
    resourceType: string,
    quality: number,
    description: string,
    lastHarvested: string
  ) => void;
}

export default function CreateResourceTab({
  items,
  coordinateX,
  coordinateY,
  onCreateResource,
}: CreateResourceTabProps) {
  const t = useTranslations();
  const [resourceTypeInput, setResourceTypeInput] = useState("");
  const [qualityInput, setQualityInput] = useState(1);
  const [descriptionInput, setDescriptionInput] = useState("");
  const [lastHarvestedInput, setLastHarvestedInput] = useState(
    new Date().toISOString().split("T")[0]
  );

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onCreateResource(
      resourceTypeInput,
      qualityInput,
      descriptionInput,
      lastHarvestedInput
    );
    setResourceTypeInput("");
    setQualityInput(1);
    setDescriptionInput("");
    setLastHarvestedInput(new Date().toISOString().split("T")[0]);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="resourcetype">{t("Resource Type")}</label>
        <select
          className="form-control"
          id="resourcetype"
          value={resourceTypeInput}
          onChange={(e) => setResourceTypeInput(e.target.value)}
          required
        >
          <option value="">{t("Select a resource type")}</option>
          {items.map((item) => (
            <option key={item.id} value={item.type}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="quality">{t("Quality")}</label>
        <input
          type="number"
          className="form-control"
          id="quality"
          min={1}
          max={100}
          value={qualityInput}
          onChange={(e) => setQualityInput(Number(e.target.value))}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="description">{t("Description")}</label>
        <textarea
          className="form-control"
          id="description"
          value={descriptionInput}
          onChange={(e) => setDescriptionInput(e.target.value)}
          maxLength={200}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="lastharvested">{t("Last Harvested")}</label>
        <input
          type="date"
          className="form-control"
          id="lastharvested"
          value={lastHarvestedInput}
          onChange={(e) => setLastHarvestedInput(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="coordinates">{t("Coordinates")}</label>
        <div className="row" id="coordinates">
          <div className="col-6">
            <input
              type="number"
              className="form-control"
              value={coordinateX}
              readOnly
            />
          </div>
          <div className="col-6">
            <input
              type="number"
              className="form-control"
              value={coordinateY}
              readOnly
            />
          </div>
        </div>
      </div>
      <button
        type="submit"
        className="btn btn-lg btn-outline-success btn-block"
      >
        {t("Create Resource")}
      </button>
    </form>
  );
}
