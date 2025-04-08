export enum WalkerUse {
  PVP = "pvp",
  FARMING = "farming",
  PERSONAL = "personal",
  RAM = "ram",
}

export enum WalkerEnum {
  BUFFALO = "Buffalo",
  CAMELOP = "Camelop",
  COBRA = "Cobra",
  DINGHY = "Dinghy",
  DOMUS = "Domus",
  FALCO = "Falco",
  FIREFLY = "Firefly",
  HORNET = "Hornet",
  MOLLUSK = "Mollusk",
  PANDA = "Panda",
  PROXY = "Proxy",
  SCHMETTERLING = "Schmetterling",
  NOMAD_SPIDER = "Nomad Spider",
  STILETTO = "Stiletto",
  TITAN = "Titan",
  TOBOGGAN = "Toboggan",
  TUSKER = "Tusker",
  SILUR = "Silur",
  HERCUL = "Hercul",
  BALANG = "Balang",
  RAPTOR_SKY = "Raptor Sky",
}

export type GetWalkersRequestParams = {
  pageSize?: string | number;
  page?: string | number;
  name?: string;
  owner?: string;
  lastuser?: string;
  walkerid?: string;
  ready?: boolean;
  use?: WalkerUse;
  type?: WalkerEnum;
  description?: string;
};

export type EditWalkerRequestBody = {
  owner: string;
  ready: boolean;
  use: WalkerUse;
  type: WalkerEnum;
  description: string;
};

export type WalkerInfo = {
  leaderid?: string;
  discordid: string;
  walkerid: number;
  name: string;
  ownerUser?: string;
  lastuser?: string;
  datelastuse?: string;
  type?: WalkerEnum;
  use?: WalkerUse;
  isReady: boolean;
  description?: string;
};
