'use client';

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapExtendedProps {
  maxZoom: number;
  style: CSSProperties;
  onClick: (e: L.LeafletMouseEvent) => void;
  center: [number, number] | null;
  children: ReactNode;
}

export default function MapExtended({
  maxZoom,
  style,
  onClick,
  center,
  children,
}: MapExtendedProps) {
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) {
      const img = [4065, 4065];
      const mapInstance = L.map('map', {
        crs: L.CRS.Simple,
        maxZoom,
      });

      mapInstance.setView([img[0], img[1]], 2);
      mapInstance.on('click', onClick);
      mapRef.current = mapInstance;
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [maxZoom, onClick]);

  useEffect(() => {
    if (mapRef.current && center) {
      mapRef.current.setView(center);
    }
  }, [center]);

  return <div id="map" style={style}>{children}</div>;
} 