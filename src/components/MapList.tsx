"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Icon from "@/components/Icon";
import type { MapFilters } from "./MapFilter";

interface Resource {
  id: string;
  name: string;
  quantity: number;
  type: string;
}

interface MapListItem {
  id: string;
  name: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  region: string;
  resources: Resource[];
  lastUpdated: string;
  isFavorite: boolean;
}

interface MapListProps {
  maps: MapListItem[];
  filters: MapFilters;
  onToggleFavorite: (mapId: string) => Promise<void>;
  onError?: (error: string) => void;
}

export default function MapList({
  maps,
  filters,
  onToggleFavorite,
  onError,
}: MapListProps) {
  const t = useTranslations();
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-success";
      case "medium":
        return "bg-warning";
      case "hard":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  };

  const handleFavoriteClick = async (mapId: string) => {
    try {
      setLoading((prev) => ({ ...prev, [mapId]: true }));
      await onToggleFavorite(mapId);
    } catch {
      onError?.("Error al actualizar favoritos");
    } finally {
      setLoading((prev) => ({ ...prev, [mapId]: false }));
    }
  };

  const filteredMaps = maps.filter((map) => {
    if (filters.region && map.region !== filters.region) {
      return false;
    }
    if (filters.difficulty !== "all" && map.difficulty !== filters.difficulty) {
      return false;
    }
    if (filters.resource) {
      const hasResource = map.resources.some(
        (resource) => resource.name === filters.resource
      );
      if (!hasResource) {
        return false;
      }
    }
    return true;
  });

  if (filteredMaps.length === 0) {
    return (
      <div className="alert alert-info" role="alert">
        {t("No maps found matching the selected filters")}
      </div>
    );
  }

  return (
    <div className="list-group">
      {filteredMaps.map((map) => (
        <div key={map.id} className="list-group-item list-group-item-action">
          <div className="d-flex w-100 justify-content-between align-items-center mb-2">
            <h5 className="mb-0">
              <Link
                href={`/maps/${map.id}`}
                className="text-decoration-none text-reset"
              >
                {t(map.name)}
              </Link>
            </h5>
            <div className="d-flex gap-2 align-items-center">
              <span className={`badge ${getDifficultyColor(map.difficulty)}`}>
                {t(map.difficulty)}
              </span>
              <button
                type="button"
                className={`btn btn-sm ${
                  map.isFavorite ? "btn-warning" : "btn-outline-warning"
                }`}
                onClick={() => handleFavoriteClick(map.id)}
                disabled={loading[map.id]}
              >
                <i
                  className={`fas fa-star ${loading[map.id] ? "fa-spin" : ""}`}
                />
              </button>
            </div>
          </div>
          <p className="mb-2 text-muted">{t(map.description)}</p>
          <div className="d-flex flex-wrap gap-3 align-items-center">
            <div className="small">
              <i className="fas fa-map-marker-alt me-1" />
              {map.region}
            </div>
            <div className="small">
              <i className="fas fa-clock me-1" />
              {t("Last updated")}: {new Date(map.lastUpdated).toLocaleString()}
            </div>
            <div className="d-flex gap-2 flex-wrap">
              {map.resources.map((resource) => (
                <span
                  key={resource.id}
                  className="badge bg-light text-dark d-flex align-items-center gap-1"
                >
                  <Icon name={resource.name} />
                  {t(resource.name)}: {resource.quantity}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
