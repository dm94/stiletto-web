import type React from "react";
import { useEffect, useRef, forwardRef } from "react";
import L from "leaflet";
import { MapContainer, useMap } from "react-leaflet";
import type { MapContainerProps } from "react-leaflet";

// Import our custom RasterCoords implementation
// This replaces the outdated leaflet-rastercoords library
import { createRasterCoords } from "./RasterCoordsUtil";

// This component initializes the RasterCoords functionality after the map is loaded
interface RasterCoordsInitializerProps {
  center?: [number, number];
}

const RasterCoordsInitializer: React.FC<RasterCoordsInitializerProps> = ({
  center,
}) => {
  const map = useMap();

  // This effect runs only once on initialization
  useEffect(() => {
    const img: [number, number] = [4065, 4065];

    // Initialize RasterCoords with the map instance using our custom implementation
    const rc = createRasterCoords(map, img);

    // Set the initial view to the center of the image if no center is provided
    // Calculate the center coordinates of the image
    const centerX = img[0] / 2;
    const centerY = img[1] / 2;
    const defaultCenter = rc.unproject([centerX, centerY]);

    // Use the provided center or default to the center of the image
    // Only set the initial view if the map doesn't already have a view set
    if (!map.getCenter() || map.getZoom() === undefined) {
      map.setView(
        center ? new L.LatLng(center[0], center[1]) : defaultCenter,
        2,
      );
    }

    // Store the rasterCoords instance on the map for potential external access
    (map as any).rasterCoords = rc;

    // Add event listeners to track user interactions with the map
    const onMoveEnd = () => {
      // This prevents the map from resetting to the initial position
      // We don't need to do anything here, just having this handler prevents the reset
    };

    map.on("moveend", onMoveEnd);

    // Clean up event listeners when component unmounts
    return () => {
      map.off("moveend", onMoveEnd);
    };
  }, [map]); // Remove center from dependencies to prevent reinitialization

  // Update the map view ONLY when the center prop changes and is explicitly provided
  useEffect(() => {
    if (center && map && center[0] !== 0 && center[1] !== 0) {
      map.setView(new L.LatLng(center[0], center[1]), map.getZoom());
    }
  }, [center, map]);

  return null;
};

// Create a forwardRef component to properly handle React component requirements
const MapExtended = forwardRef<L.Map, MapContainerProps>((props, ref) => {
  const mapRef = useRef<L.Map | null>(null);

  // Combine the external ref with our internal ref
  const setMapRef = (map: L.Map) => {
    mapRef.current = map;

    if (ref) {
      if (typeof ref === "function") {
        ref(map);
      } else {
        (ref as React.RefObject<L.Map>).current = map;
      }
    }
  };

  return (
    <MapContainer {...props} ref={setMapRef}>
      {props.children}
      <RasterCoordsInitializer
        center={props.center as [number, number] | undefined}
      />
    </MapContainer>
  );
});

export default MapExtended;
