export type UpdateClanRequestParams = {
  clanname?: string;
  clancolor?: string;
  clandiscord?: string;
  recruit?: boolean;
  region?: string;
  symbol?: string;
};

export type CreateClanRequestParams = {
  clanname: string;
  clancolor?: string;
  clandiscord?: string;
  recruit?: boolean;
  region?: string;
  symbol?: string;
};

export type GetClansRequestParams = {
  pageSize?: number;
  page?: number;
  name?: string;
  region?: string;
};
