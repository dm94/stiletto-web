export interface MapData {
  idMap: string;
  name: string;
  image: string;
  allowedit: boolean;
}

export interface MapResponse {
  IdMap: string;
  PassMap: string;
}

export interface Resource {
  id: string;
  resourcetype: string;
  quality: number;
  description: string;
  x: number;
  y: number;
  harvested: string;
  token?: string;
}

export interface Marker {
  id: string;
  name: string;
  icon: string;
}

export interface CreateResourceParams {
  mapid: string;
  x: number;
  y: number;
  mappass: string;
  resourcetype: string;
  quality: number;
  description: string;
  harvested: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
} 