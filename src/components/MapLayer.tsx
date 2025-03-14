'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { config } from '@/config/config';
import type { Resource } from '@/types/Resource';
import type { GameMap } from '@/types/GameMap';

interface MapLayerProps {
  map: GameMap;
  resources: Resource[];
  onSetCoordinates: (x: number, y: number) => void;
  center: [number, number] | null;
}

export default function MapLayer({
  map,
  resources,
  onSetCoordinates,
  center,
}: MapLayerProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapRef.current) {
      const mapInstance = L.map('map', {
        crs: L.CRS.Simple,
        minZoom: -2,
      });

      const bounds: L.LatLngBoundsLiteral = [
        [0, 0],
        [1000, 1000],
      ];

      L.imageOverlay(
        `${config.RESOURCES_URL}/maps/${map.name.toLowerCase()}.jpg`,
        bounds
      ).addTo(mapInstance);

      mapInstance.fitBounds(bounds);
      mapRef.current = mapInstance;

      mapInstance.on('click', (e) => {
        const { lat, lng } = e.latlng;
        onSetCoordinates(Math.round(lng), Math.round(lat));
      });

      markersRef.current = L.layerGroup().addTo(mapInstance);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [map.name, onSetCoordinates]);

  useEffect(() => {
    if (mapRef.current && markersRef.current) {
      markersRef.current.clearLayers();

      for (const resource of resources) {
        const marker = L.marker([resource.y, resource.x], {
          icon: L.divIcon({
            className: 'resource-marker',
            html: `<i class="fas fa-${getResourceIcon(resource.resourcetype)}"></i>`,
          }),
        });

        marker.bindPopup(`
          <h6>${resource.resourcetype}</h6>
          <p>Quality: ${resource.quality}</p>
          <p>${resource.description}</p>
          <small>Last harvested: ${new Date(resource.harvested).toLocaleString()}</small>
        `);

        if (markersRef.current) {
          marker.addTo(markersRef.current);
        }
      }
    }
  }, [resources]);

  useEffect(() => {
    if (mapRef.current && center) {
      mapRef.current.setView(center);
    }
  }, [center]);

  const getResourceIcon = (resourceType: string): string => {
    switch (resourceType.toLowerCase()) {
      case 'wood':
        return 'tree';
      case 'stone':
        return 'mountain';
      case 'fiber':
        return 'leaf';
      case 'hide':
        return 'paw';
      case 'iron':
        return 'hammer';
      default:
        return 'question';
    }
  };

  return <div id="map" style={{ height: '100vh' }} />;
} 