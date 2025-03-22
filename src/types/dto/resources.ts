export type AddResourceMapRequestParams = {
  mappass: string;
  resourcetype: string;
  quality?: number;
  x: number;
  y: number;
  description?: string;
  harvested?: string;
};

export type ResourceInfo = {
  resourceid: number;
  mapid: number;
  resourcetype: string;
  quality: number;
  x: number;
  y: number;
  token?: string;
  typemap: string;
  description?: string;
  lastharvested?: string;
};

export type EditResourceRequestParams = {
  token: string;
  description?: string;
  harvested?: string;
};
