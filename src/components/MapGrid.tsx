"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Icon from "@/components/Icon";
import type { MapFilters } from "./MapFilter";

interface MapPreview {
  id: string;
  name: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  region: string;
  mainResource: {
    name: string;
    quantity: number;
  };
  isFavorite: boolean;
}

interface MapGridProps {
  maps: MapPreview[];
  filters: MapFilters;
  onToggleFavorite: (mapId: string) => Promise<void>;
  onError?: (error: string) => void;
}

export default function MapGrid({
  maps,
  filters,
  onToggleFavorite,
  onError,
}: MapGridProps) {
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
    if (filters.resource && map.mainResource.name !== filters.resource) {
      return false;
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
    <div className="row g-4">
      {filteredMaps.map((map) => (
        <div key={map.id} className="col-md-6 col-lg-4">
          <div className="card h-100">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h6 className="card-title mb-0">
                <Link
                  href={`/maps/${map.id}`}
                  className="text-decoration-none text-reset"
                >
                  {t(map.name)}
                </Link>
              </h6>
              <div className="d-flex gap-2">
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
                    className={`fas fa-star ${
                      loading[map.id] ? "fa-spin" : ""
                    }`}
                  />
                </button>
              </div>
            </div>
            <div className="card-body">
              <p className="card-text small text-muted mb-3">
                {t(map.description)}
              </p>
              <div className="d-flex justify-content-between align-items-center">
                <div className="small">
                  <i className="fas fa-map-marker-alt me-1" />
                  {map.region}
                </div>
                <div className="small">
                  <Icon name={map.mainResource.name} />
                  {t(map.mainResource.name)}: {map.mainResource.quantity}
                </div>
              </div>
            </div>
            <div className="card-footer">
              <Link
                href={`/maps/${map.id}`}
                className="btn btn-primary btn-sm w-100"
              >
                {t("View Details")}
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
