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
  // Use a ref to track if this is the first render
  const initializedRef = useRef(false);
  // Use a ref to track the last center prop value to detect actual changes
  const lastCenterRef = useRef<[number, number] | undefined>(center);

  useEffect(() => {
    const img: [number, number] = [4065, 4065];

    // Initialize RasterCoords with the map instance using our custom implementation
    const rc = createRasterCoords(map, img);

    // Store the rasterCoords instance on the map for potential external access
    (map as any).rasterCoords = rc;

    // Only set the initial view on first mount
    if (!initializedRef.current) {
      // Calculate the center coordinates of the image
      const centerX = img[0] / 2;
      const centerY = img[1] / 2;
      const defaultCenter = rc.unproject([centerX, centerY]);

      // Use the provided center or default to the center of the image
      map.setView(
        center ? new L.LatLng(center[0], center[1]) : defaultCenter,
        2,
      );
      initializedRef.current = true;
    }

    // Set up a listener to track map movement
    const onMoveEnd = () => {
      // This will capture the user's current view position
      // but we don't need to do anything with it as the map already maintains its own state
    };

    map.on("moveend", onMoveEnd);

    return () => {
      map.off("moveend", onMoveEnd);
    };
  }, [map]);

  // Only update the view when the center prop explicitly changes to a new value
  useEffect(() => {
    // Skip if this is the initial render or if center hasn't actually changed
    if (
      !center ||
      !initializedRef.current ||
      (lastCenterRef.current &&
        lastCenterRef.current[0] === center[0] &&
        lastCenterRef.current[1] === center[1])
    ) {
      return;
    }

    // Update the last center ref
    lastCenterRef.current = center;

    // Only set the view if the center prop has explicitly changed
    map.setView(new L.LatLng(center[0], center[1]), map.getZoom());
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
