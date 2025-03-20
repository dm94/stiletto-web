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
