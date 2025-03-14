export interface Resource {
  id: string;
  x: number;
  y: number;
  resourcetype: string;
  quality: number;
  description: string;
  harvested: string;
  token?: string;
} 