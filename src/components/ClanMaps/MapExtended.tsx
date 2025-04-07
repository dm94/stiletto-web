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

  // Track if the map has been initialized
  const initializedRef = useRef(false);
  // Track the last explicitly set center
  const lastCenterRef = useRef<[number, number] | undefined>(center);
  // Track if the center was set by user interaction (panning/zooming)
  const userInteractionRef = useRef(false);

  // This effect handles the initial setup of the map
  useEffect(() => {
    // Only run initialization once
    if (initializedRef.current) {
      return;
    }

    const img: [number, number] = [4065, 4065];

    // Initialize RasterCoords with the map instance using our custom implementation
    const rc = createRasterCoords(map, img);

    // Set the initial view to the center of the image if no center is provided
    // Calculate the center coordinates of the image
    const centerX = img[0] / 2;
    const centerY = img[1] / 2;
    const defaultCenter = rc.unproject([centerX, centerY]);

    // Use the provided center or default to the center of the image
    map.setView(center ? new L.LatLng(center[0], center[1]) : defaultCenter, 2);

    // Store the rasterCoords instance on the map for potential external access
    (map as any).rasterCoords = rc;

    // Add event listeners to track user interactions with the map
    map.on("moveend", () => {
      // Only mark as user interaction if it wasn't programmatically set
      if (!userInteractionRef.current) {
        userInteractionRef.current = true;
      }
    });

    // Mark as initialized to prevent re-initialization
    initializedRef.current = true;
    lastCenterRef.current = center;
  }, [map]); // Only depend on map to run once on initialization

  // This effect only handles explicit center prop changes from parent components
  useEffect(() => {
    // Skip during initial render as the initialization effect handles it
    if (!initializedRef.current) {
      return;
    }

    // Only update the view if center is explicitly provided, different from last center,
    // and not overridden by user interaction
    if (center && map?.getCenter()) {
      // Check if the center prop has actually changed from the last explicit center
      const centerChanged =
        !lastCenterRef.current ||
        center[0] !== lastCenterRef.current[0] ||
        center[1] !== lastCenterRef.current[1];

      // Only set the view if the center has changed and user hasn't interacted with the map
      // or if we're explicitly forcing the center update
      if (centerChanged && !userInteractionRef.current) {
        map.setView(new L.LatLng(center[0], center[1]), map.getZoom());
        // Update the last center reference
        lastCenterRef.current = center;
      }
    }
  }, [center, map]);

  // Only reset user interaction flag when center prop changes intentionally
  useEffect(() => {
    if (
      center &&
      lastCenterRef.current &&
      (center[0] !== lastCenterRef.current[0] ||
        center[1] !== lastCenterRef.current[1])
    ) {
      // Only reset the user interaction flag if the center has actually changed
      userInteractionRef.current = false;
    }
  }, [center]);

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
