export type AddResourceRequestParams = {
  mappass: string;
  resourcetype: string;
  quality?: number;
  x: number;
  y: number;
  description?: string;
  harvested?: string;
};

export type Resource = {
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
