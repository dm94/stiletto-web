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
   */
  unproject(point: [number, number]): L.LatLng {
    const x = point[0];
    const y = point[1];

    // Create a proper CRS transformation for the image coordinates
    // This ensures the coordinates are properly mapped to the Leaflet coordinate system
    const pixelPoint = new L.Point(x, y);
    const maxZoom = this.map.getMaxZoom();
    const scale = this.map.getZoomScale(maxZoom, maxZoom);
    const nwPoint = this.pixelOrigin.multiplyBy(scale);

    // Apply transformation to convert from pixel coordinates to Leaflet coordinates
    const latLng = this.map.unproject(
      nwPoint.add(pixelPoint.multiplyBy(scale)),
      maxZoom,
    );

    return latLng;
  }

  /**
   * Convert Leaflet coordinates to pixel coordinates
   */
  project(latLng: L.LatLng | [number, number]): [number, number] {
    let latlng: L.LatLng;

    if (Array.isArray(latLng)) {
      latlng = new L.LatLng(latLng[0], latLng[1]);
    } else {
      latlng = latLng;
    }

    const point = this.map.project(latlng, this.map.getMaxZoom());
    return [point.x, point.y];
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
