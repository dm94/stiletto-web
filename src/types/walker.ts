// Type definitions for walker-related data

// Walker data structure
export interface Walker {
  walkerid: string;
  discordid: string;
  discordtag: string;
  walkertype: string;
  description: string;
  usewalker: string;
  isready: boolean;
  date: string;
}

// Extended Walker interface used in the UI components
export interface WalkerUI {
  walkerID: string;
  ownerUser: string;
  lastUser: string;
  datelastuse: string;
  walker_use: string;
  type: string;
  description: string;
  isReady: boolean;
  name: string;
}

// Walker type data
export interface WalkerType {
  name: string;
  category?: string;
}

// Walker request parameters
export interface WalkerRequestParams {
  pageSize?: string | number;
  page?: string | number;
  walkertype?: string;
  usewalker?: string;
  isready?: string;
  description?: string;
}
