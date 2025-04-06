/**
 * Custom implementation of leaflet-rastercoords functionality
 * This replaces the need for the external leaflet-rastercoords library
 * and is compatible with Leaflet 1.9.4 and React Leaflet 5.0.0
 */
import L from "leaflet";

export interface RasterCoordsType {
  unproject: (point: [number, number]) => L.LatLng;
  project: (point: L.LatLng | [number, number]) => [number, number];
  setMaxBounds: () => void;
  getMaxBounds: () => L.LatLngBounds;
  setZoom: (zoom: number) => void;
  zoomByFactor: (factor: number) => void;
}

export class RasterCoords implements RasterCoordsType {
  private map: L.Map;
  private imgSize: [number, number];
  private tileSize: number;
  private pixelOrigin: L.Point;
  private projection: L.Transformation;
  private transformation: L.Transformation;
  private scale: number;

  constructor(map: L.Map, imgSize: [number, number], tileSize = 256) {
    this.map = map;
    this.imgSize = imgSize;
    this.tileSize = tileSize;
    this.pixelOrigin = new L.Point(0, 0);

    // Simple transformation to convert pixel coordinates to Leaflet coordinates
    this.projection = new L.Transformation(1, 0, -1, 0);
    this.transformation = new L.Transformation(1, 0, 1, 0);
    this.scale = 1;

    // Set the max bounds of the map to the image dimensions
    this.setMaxBounds();
  }

  /**
   * Convert pixel coordinates to Leaflet coordinates
   * This custom implementation ensures proper coordinate transformation
   */
  unproject(point: [number, number]): L.LatLng {
    const x = point[0];
    const y = point[1];

    // Calculate the zoom factor based on the current zoom level
    const zoom = this.map.getZoom() ?? this.map.getMaxZoom();
    const scale = this.tileSize * 2 ** zoom;

    // Apply custom transformation to convert pixel coordinates to lat/lng
    // The y-coordinate is inverted because Leaflet's coordinate system has y increasing from bottom to top
    // while image coordinates have y increasing from top to bottom
    const lat = (this.imgSize[1] - y) / scale;
    const lng = x / scale;

    return new L.LatLng(lat, lng);
  }

  /**
   * Convert Leaflet coordinates to pixel coordinates
   * This custom implementation ensures proper coordinate transformation
   */
  project(latLng: L.LatLng | [number, number]): [number, number] {
    let latlng: L.LatLng;

    if (Array.isArray(latLng)) {
      latlng = new L.LatLng(latLng[0], latLng[1]);
    } else {
      latlng = latLng;
    }

    // Calculate the zoom factor based on the current zoom level
    const zoom = this.map.getZoom() || this.map.getMaxZoom();
    const scale = this.tileSize * 2 ** zoom;

    // Apply custom transformation to convert lat/lng to pixel coordinates
    // The y-coordinate is inverted because Leaflet's coordinate system has y increasing from bottom to top
    // while image coordinates have y increasing from top to bottom
    const x = latlng.lng * scale;
    const y = this.imgSize[1] - latlng.lat * scale;

    return [x, y];
  }

  /**
   * Set the maximum bounds of the map based on the image dimensions
   */
  setMaxBounds(): void {
    const southWest = this.unproject([0, this.imgSize[1]]);
    const northEast = this.unproject([this.imgSize[0], 0]);
    const bounds = new L.LatLngBounds(southWest, northEast);

    this.map.setMaxBounds(bounds);
  }

  /**
   * Get the maximum bounds of the map
   */
  getMaxBounds(): L.LatLngBounds {
    const southWest = this.unproject([0, this.imgSize[1]]);
    const northEast = this.unproject([this.imgSize[0], 0]);
    return new L.LatLngBounds(southWest, northEast);
  }

  /**
   * Set the zoom level of the map
   */
  setZoom(zoom: number): void {
    this.map.setZoom(zoom);
  }

  /**
   * Zoom the map by a factor
   */
  zoomByFactor(factor: number): void {
    const currentZoom = this.map.getZoom();
    if (currentZoom !== undefined) {
      this.map.setZoom(currentZoom + Math.log2(factor));
    }
  }
}

/**
 * Create a new RasterCoords instance
 */
export function createRasterCoords(
  map: L.Map,
  imgSize: [number, number],
  tileSize = 256,
): RasterCoordsType {
  return new RasterCoords(map, imgSize, tileSize);
}
