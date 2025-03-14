"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { config } from "@/config/config";
import { getStoredItem } from "@/lib/services";
import Icon from "@/components/Icon";

interface Resource {
  id: string;
  name: string;
  quantity: number;
  type: string;
}

interface MapLocation {
  x: number;
  y: number;
  region: string;
}

interface MapDetails {
  id: string;
  name: string;
  description: string;
  resources: Resource[];
  location: MapLocation;
  difficulty: "easy" | "medium" | "hard";
  lastUpdated: string;
}

interface MapDetailsProps {
  mapId: string;
  onError?: (error: string) => void;
}

export default function MapDetails({ mapId, onError }: MapDetailsProps) {
  const t = useTranslations();
  const [mapDetails, setMapDetails] = useState<MapDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMapDetails = async () => {
      try {
        const response = await fetch(`${config.API_URL}/maps/${mapId}`, {
          headers: {
            Authorization: `Bearer ${getStoredItem("token")}`,
          },
        });

        if (response.status === 200) {
          const data = await response.json();
          setMapDetails(data);
        } else if (response.status === 401) {
          onError?.("No tienes acceso aquí, intenta iniciar sesión de nuevo");
        } else if (response.status === 404) {
          onError?.("Mapa no encontrado");
        }
      } catch {
        onError?.("Error al cargar los detalles del mapa");
      } finally {
        setLoading(false);
      }
    };

    if (mapId) {
      fetchMapDetails();
    }
  }, [mapId, onError]);

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border">
          <span className="visually-hidden">{t("Loading...")}</span>
        </div>
      </div>
    );
  }

  if (!mapDetails) {
    return (
      <div className="alert alert-warning" role="alert">
        {t("Map not found")}
      </div>
    );
  }

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

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="card-title mb-0">{t(mapDetails.name)}</h5>
        <span className={`badge ${getDifficultyColor(mapDetails.difficulty)}`}>
          {t(mapDetails.difficulty)}
        </span>
      </div>
      <div className="card-body">
        <p className="card-text">{t(mapDetails.description)}</p>

        <h6 className="mt-4 mb-3">{t("Location")}</h6>
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className="input-group">
              <span className="input-group-text">X</span>
              <input
                type="text"
                className="form-control"
                value={mapDetails.location.x}
                readOnly
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="input-group">
              <span className="input-group-text">Y</span>
              <input
                type="text"
                className="form-control"
                value={mapDetails.location.y}
                readOnly
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="input-group">
              <span className="input-group-text">{t("Region")}</span>
              <input
                type="text"
                className="form-control"
                value={mapDetails.location.region}
                readOnly
              />
            </div>
          </div>
        </div>

        <h6 className="mb-3">{t("Resources")}</h6>
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th>{t("Resource")}</th>
                <th>{t("Type")}</th>
                <th>{t("Quantity")}</th>
              </tr>
            </thead>
            <tbody>
              {mapDetails.resources.map((resource) => (
                <tr key={resource.id}>
                  <td>
                    <Icon name={resource.name} /> {t(resource.name)}
                  </td>
                  <td>{t(resource.type)}</td>
                  <td>{resource.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-muted">
          <small>
            {t("Last updated")}:{" "}
            {new Date(mapDetails.lastUpdated).toLocaleString()}
          </small>
        </div>
      </div>
    </div>
  );
}
