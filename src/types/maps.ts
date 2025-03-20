import type { Resource } from "./dto/resources";

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
