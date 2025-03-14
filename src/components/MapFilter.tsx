"use client";

import type { ChangeEvent } from "react";
import { useTranslations } from "next-intl";

interface MapFilterProps {
  onFilterChange: (filters: (prev: MapFilters) => MapFilters) => void;
  regions: string[];
  resources: Array<{ id: string; name: string }>;
}

export interface MapFilters {
  region: string;
  difficulty: "all" | "easy" | "medium" | "hard";
  resource: string;
}

export default function MapFilter({
  onFilterChange,
  regions,
  resources,
}: MapFilterProps) {
  const t = useTranslations();

  const handleFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFilterChange((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h5 className="card-title mb-0">{t("Filter Maps")}</h5>
      </div>
      <div className="card-body">
        <div className="row g-3">
          <div className="col-md-4">
            <label htmlFor="region" className="form-label">
              {t("Region")}
            </label>
            <select
              id="region"
              name="region"
              className="form-select"
              onChange={handleFilterChange}
            >
              <option value="">{t("All Regions")}</option>
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <label htmlFor="difficulty" className="form-label">
              {t("Difficulty")}
            </label>
            <select
              id="difficulty"
              name="difficulty"
              className="form-select"
              onChange={handleFilterChange}
            >
              <option value="all">{t("All Difficulties")}</option>
              <option value="easy">{t("Easy")}</option>
              <option value="medium">{t("Medium")}</option>
              <option value="hard">{t("Hard")}</option>
            </select>
          </div>
          <div className="col-md-4">
            <label htmlFor="resource" className="form-label">
              {t("Resource")}
            </label>
            <select
              id="resource"
              name="resource"
              className="form-select"
              onChange={handleFilterChange}
            >
              <option value="">{t("All Resources")}</option>
              {resources.map((resource) => (
                <option key={resource.id} value={resource.id}>
                  {t(resource.name)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
