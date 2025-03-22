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
  region?: string;
  symbol?: string;
  recruit?: boolean;
};

export type GetClansRequestParams = {
  pageSize?: number;
  page?: number;
  name?: string;
  region?: string;
};

export type ClanInfo = {
  clanid: number;
  name: string;
  discordid?: string;
  leaderid: string;
  invitelink?: string;
  recruitment: boolean;
  flagcolor?: string;
  symbol?: string;
  region: string;
  discordTag: string;
};
