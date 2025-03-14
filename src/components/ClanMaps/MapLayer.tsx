"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Resource } from "@/types/maps";

interface MapLayerProps {
  resources: Resource[] | null;
  center: [number, number] | null;
  onDeleteResource: (resourceId: string, resourceToken: string) => void;
  onUpdateResource: (
    mapId: string,
    resourceId: string,
    resourceToken: string,
    newTime: string
  ) => void;
  onCoordinateSelect: (x: number, y: number) => void;
}

export default function MapLayer({
  resources,
  center,
  onDeleteResource,
  onUpdateResource,
  onCoordinateSelect,
}: MapLayerProps) {
  const t = useTranslations();
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("map", {
        center: [0, 0],
        zoom: 3,
        maxZoom: 5,
        minZoom: 1,
        crs: L.CRS.Simple,
      });

      L.tileLayer("/map/{z}/{x}/{y}.png", {
        attribution: "&copy; Last Oasis",
        tms: true,
      }).addTo(mapRef.current);

      markersRef.current = L.layerGroup().addTo(mapRef.current);

      mapRef.current.on("click", (e) => {
        const { lat, lng } = e.latlng;
        onCoordinateSelect(lng, lat);
      });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [onCoordinateSelect]);

  useEffect(() => {
    if (center && mapRef.current) {
      mapRef.current.setView(center, 3);
    }
  }, [center]);

  useEffect(() => {
    if (!markersRef.current || !resources) return;

    markersRef.current.clearLayers();

    resources.forEach((resource) => {
      const marker = L.marker([resource.y, resource.x], {
        icon: L.divIcon({
          className: "resource-marker",
          html: `<div class="bg-blue-500 p-2 rounded-full text-white text-xs">${resource.resourcetype}</div>`,
        }),
      });

      const popupContent = `
        <div class="p-2">
          <h3 class="font-bold">${resource.resourcetype}</h3>
          <p class="text-sm">${t("Quality")}: ${resource.quality}</p>
          <p class="text-sm">${t("Description")}: ${resource.description}</p>
          <p class="text-sm">${t("Last harvested")}: ${new Date(
        resource.harvested
      ).toLocaleString()}</p>
          ${
            resource.token
              ? `
                <div class="mt-2 space-y-2">
                  <button
                    class="w-full px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                    onclick="window.deleteResource('${resource.id}', '${
                  resource.token
                }')"
                  >
                    ${t("Delete")}
                  </button>
                  <button
                    class="w-full px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                    onclick="window.updateResource('${resource.id}', '${
                  resource.token
                }')"
                  >
                    ${t("Update time")}
                  </button>
                </div>
              `
              : ""
          }
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.addTo(markersRef.current!);
    });

    // Add global functions for the popup buttons
    if (typeof window !== "undefined") {
      window.deleteResource = (resourceId: string, resourceToken: string) => {
        onDeleteResource(resourceId, resourceToken);
      };

      window.updateResource = (resourceId: string, resourceToken: string) => {
        const newTime = new Date().toISOString();
        onUpdateResource(resourceId, resourceToken, newTime);
      };
    }
  }, [resources, t, onDeleteResource, onUpdateResource]);

  return <div id="map" className="w-full h-screen" />;
}
