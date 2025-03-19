// Type definitions for trade-related data

// Trade item data structure
export interface Trade {
  tradeid: string;
  discordid: string;
  discordtag: string;
  resource: string;
  type: string;
  amount: number;
  region: string;
  quality: number;
  price: number;
  date: string;
}

// Trade request parameters
export interface TradeRequestParams {
  pageSize?: string | number;
  page?: string | number;
  type?: string;
  resource?: string;
  region?: string;
}

// Trade creation parameters
export interface TradeCreateParams {
  resource: string;
  type: string;
  amount: string | number;
  region: string;
  quality: string | number;
  price: string | number;
}
