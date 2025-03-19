export enum WalkerUse {
  PVP = "pvp",
  FARMING = "farming",
  PERSONAL = "personal",
  RAM = "ram",
}

export type GetWalkersRequestParams = {
  pageSize?: string | number;
  page?: string | number;
  name?: string;
  type?: string;
  desc?: string;
  use?: WalkerUse;
  ready?: boolean;
};

export type EditWalkerRequestParams = {
  owner: string;
  use: WalkerUse;
  type: string;
  description: string;
  ready: boolean;
};
