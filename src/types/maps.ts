// Type definitions for map-related components

// Map type definition
export interface MapInfo {
  idMap?: string;
  name: string;
  image?: string;
  dateofburning?: string;
}

// Map data returned from API
export interface MapData {
  mapid: string;
  name: string;
  maptype: string;
  dateofburning: string;
  allowediting: boolean;
  discordid?: string;
  discordTag?: string;
}

// Map creation response
export interface MapCreationResponse {
  IdMap: string | number;
  PassMap: string;
}

// Resource type definition
export interface Resource {
  resourceid: string;
  mapid: string;
  resourcetype: string;
  quality: number;
  x: number;
  y: number;
  description?: string;
  lastharvested?: string;
  token?: string;
}

// Props for CreateMapNoLog component
export interface CreateMapNoLogProps {
  onOpen: (id: string | number, pass: string) => void;
}

// Props for CreateMapPanel component
export interface CreateMapPanelProps {
  maps: MapInfo[] | null;
  onCreateMap: (
    event: React.FormEvent,
    mapName: string,
    mapDate: string,
    mapType: string,
  ) => void;
}

// Props for MapSelectList component
export interface MapSelectListProps {
  maps: MapInfo[] | null;
  mapSelectInput: string;
  onSelectMap: (mapName: string) => void;
}

// Props for ResourceMapNoLog component
export interface ResourceMapNoLogProps {
  mapId?: string;
  pass?: string;
}

// Props for ResourcesInMapList component
export interface ResourcesInMapListProps {
  resources: Resource[] | null;
  onFilter?: (resourceType: string) => void;
  onSelect?: (x: number, y: number) => void;
  onDeleteResource?: (resourceId: string, resourceToken: string) => void;
}

// Props for CreateResourceTab component
export interface CreateResourceTabProps {
  items: any[] | null;
  coordinateXInput: number;
  coordinateYInput: number;
  onCreateResource: (
    resourceType: string,
    quality: number,
    description: string,
    lastHarvested: string,
  ) => void;
  onChangeX: (x: number | string) => void;
  onChangeY: (y: number | string) => void;
}

// Props for MapLayer component
export interface MapLayerProps {
  resourcesInTheMap?: Resource[] | null;
  deleteResource?: (resourceId: string, resourceToken: string) => void;
  center?: [number, number] | null;
  updateResource?: (
    mapId: string,
    resourceId: string,
    token: string,
    date: string,
  ) => void;
  changeInput?: (x: number, y: number) => void;
}
