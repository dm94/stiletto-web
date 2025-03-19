export enum TradeType {
  Supply = "Supply",
  Demand = "Demand",
}

export type GetTradesQueryParams = {
  pageSize?: number;
  page?: number;
  type?: TradeType;
  resource?: string;
  region?: string;
};

export type CreateTradeRequestParams = {
  type: TradeType;
  resource: string;
  amount?: number;
  quality?: number;
  region: string;
  price: number;
};
