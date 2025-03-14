"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { config } from "@/config/config";
import { getStoredItem } from "@/lib/services";
import Icon from "@/components/Icon";

interface Resource {
  id: string;
  name: string;
  quantity: number;
  type: string;
  lastUpdated: string;
  updatedBy: string;
  location?: {
    x: number;
    y: number;
    region: string;
  };
}

interface ResourceManagerProps {
  clanId: string;
  onError?: (error: string) => void;
}

type FormDataType = {
  quantity?: number;
  location?: {
    x: number;
    y: number;
    region: string;
  };
};

export default function ResourceManager({
  clanId,
  onError,
}: ResourceManagerProps) {
  const t = useTranslations();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingResource, setEditingResource] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormDataType>({});

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await fetch(
          `${config.API_URL}/clans/${clanId}/resources`,
          {
            headers: {
              Authorization: `Bearer ${getStoredItem("token")}`,
            },
          }
        );

        if (response.status === 200) {
          const data = await response.json();
          setResources(data);
        } else if (response.status === 401) {
          onError?.("No tienes acceso aquí, intenta iniciar sesión de nuevo");
        }
      } catch {
        onError?.("Error al cargar los recursos");
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [clanId, onError]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!editingResource || !formData.quantity) {
      return;
    }

    try {
      const response = await fetch(
        `${config.API_URL}/clans/${clanId}/resources/${editingResource}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getStoredItem("token")}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.status === 200) {
        const updatedResource = await response.json();
        setResources((prev) =>
          prev.map((resource) =>
            resource.id === editingResource ? updatedResource : resource
          )
        );
        setEditingResource(null);
        setFormData({});
      } else if (response.status === 401) {
        onError?.("No tienes acceso aquí, intenta iniciar sesión de nuevo");
      }
    } catch {
      onError?.("Error al actualizar el recurso");
    }
  };

  const handleEdit = (resource: Resource) => {
    setEditingResource(resource.id);
    setFormData({
      quantity: resource.quantity,
      location: resource.location,
    });
  };

  const handleCancel = () => {
    setEditingResource(null);
    setFormData({});
  };

  const handleLocationChange = (
    field: "x" | "y",
    value: number,
    resource: Resource
  ) => {
    if (!resource.location) {
      return;
    }

    const { x, y, region } = resource.location;

    setFormData((prev) => ({
      ...prev,
      location: {
        x: field === "x" ? value : x,
        y: field === "y" ? value : y,
        region,
      },
    }));
  };

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border">
          <span className="visually-hidden">{t("Loading...")}</span>
        </div>
      </div>
    );
  }

  const resourceTypes = Array.from(
    new Set(resources.map((resource) => resource.type))
  );

  return (
    <div className="row g-4">
      {resourceTypes.map((type) => (
        <div key={type} className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="fas fa-box me-2" />
                {t(type)}
              </h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead>
                    <tr>
                      <th>{t("Resource")}</th>
                      <th>{t("Quantity")}</th>
                      <th>{t("Location")}</th>
                      <th>{t("Last Updated")}</th>
                      <th>{t("Updated By")}</th>
                      <th>{t("Actions")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resources
                      .filter((resource) => resource.type === type)
                      .map((resource) => (
                        <tr key={resource.id}>
                          <td>
                            <Icon name={resource.name} /> {t(resource.name)}
                          </td>
                          <td>
                            {editingResource === resource.id ? (
                              <input
                                type="number"
                                className="form-control form-control-sm"
                                value={formData.quantity}
                                onChange={(e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    quantity: Number(e.target.value),
                                  }))
                                }
                                min={0}
                              />
                            ) : (
                              resource.quantity
                            )}
                          </td>
                          <td>
                            {resource.location ? (
                              editingResource === resource.id ? (
                                <div className="d-flex gap-2">
                                  <input
                                    type="number"
                                    className="form-control form-control-sm"
                                    placeholder="X"
                                    value={formData.location?.x}
                                    onChange={(e) =>
                                      handleLocationChange(
                                        "x",
                                        Number(e.target.value),
                                        resource
                                      )
                                    }
                                  />
                                  <input
                                    type="number"
                                    className="form-control form-control-sm"
                                    placeholder="Y"
                                    value={formData.location?.y}
                                    onChange={(e) =>
                                      handleLocationChange(
                                        "y",
                                        Number(e.target.value),
                                        resource
                                      )
                                    }
                                  />
                                </div>
                              ) : (
                                `${resource.location.x}, ${resource.location.y} (${resource.location.region})`
                              )
                            ) : (
                              "-"
                            )}
                          </td>
                          <td>
                            {new Date(resource.lastUpdated).toLocaleString()}
                          </td>
                          <td>{resource.updatedBy}</td>
                          <td>
                            {editingResource === resource.id ? (
                              <div className="btn-group btn-group-sm">
                                <button
                                  type="button"
                                  className="btn btn-success"
                                  onClick={handleSubmit}
                                >
                                  <i className="fas fa-check" />
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-danger"
                                  onClick={handleCancel}
                                >
                                  <i className="fas fa-times" />
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                className="btn btn-primary btn-sm"
                                onClick={() => handleEdit(resource)}
                              >
                                <i className="fas fa-edit" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
