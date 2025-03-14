"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { Resource } from "@/types/Resource";

interface ResourcesInMapListProps {
  resources: Resource[];
  onDelete: (resourceId: string, resourceToken: string) => void;
  onFilter: (resourceType: string) => void;
}

export default function ResourcesInMapList({
  resources,
  onDelete,
  onFilter,
}: ResourcesInMapListProps) {
  const t = useTranslations();
  const [selectedType, setSelectedType] = useState("All");

  const handleFilterChange = (type: string) => {
    setSelectedType(type);
    onFilter(type);
  };

  const getResourceTypes = () => {
    const types = new Set<string>();
    for (const resource of resources) {
      types.add(resource.resourcetype);
    }
    return Array.from(types);
  };

  return (
    <div>
      <div className="form-group">
        <label htmlFor="resourcefilter">{t("Filter by type")}</label>
        <select
          className="form-control"
          id="resourcefilter"
          value={selectedType}
          onChange={(e) => handleFilterChange(e.target.value)}
        >
          <option value="All">{t("All")}</option>
          {getResourceTypes().map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <div className="table-responsive">
        <table className="table table-sm table-dark">
          <thead>
            <tr>
              <th>{t("Type")}</th>
              <th>{t("Quality")}</th>
              <th>{t("Description")}</th>
              <th>{t("Last Harvested")}</th>
              <th>{t("Actions")}</th>
            </tr>
          </thead>
          <tbody>
            {resources.map((resource) => (
              <tr key={resource.id}>
                <td>{resource.resourcetype}</td>
                <td>{resource.quality}</td>
                <td>{resource.description}</td>
                <td>{new Date(resource.harvested).toLocaleString()}</td>
                <td>
                  {resource.token && (
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={() =>
                        onDelete(resource.id, resource.token || "")
                      }
                    >
                      <i className="fas fa-trash-alt" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
