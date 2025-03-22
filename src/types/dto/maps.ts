export type AddMapRequestParams = {
  mapname: string;
  mapdate: string;
  maptype: string;
};

export type MapInfo = {
  mapid: number;
  typemap: string;
  discordid: string;
  name: string;
  dateofburning?: string;
  pass?: string;
  allowedit: boolean;
  discordTag?: string;
};

export type MapJsonInfo = {
  idMap: number;
  name: string;
  type: string;
  image: string;
};

export type EditMapRequestParams = {
  mapname: string;
  mapdate?: string;
  allowediting?: boolean;
  mappass: string;
};
