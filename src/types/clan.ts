// Type definitions for clan-related data

// Clan member data
export interface ClanMember {
  discordid: string;
  discordtag: string;
  nameinlo?: string;
  isleader: boolean;
  permissions: {
    canmanagemembers?: boolean;
    canmanageclan?: boolean;
    canmanagebot?: boolean;
    canmanagewalkers?: boolean;
    canmanagemaps?: boolean;
    canmanagediplomacy?: boolean;
  };
}

// Clan request data
export interface ClanRequest {
  requestid: string;
  discordid: string;
  discordtag: string;
  message?: string;
  date: string;
}

// Clan relation data
export interface ClanRelation {
  relationid: string;
  clanid: string;
  otherclanid: string;
  otherclanname: string;
  otherclanflagcolor: string;
  otherclanflagsymbol: string;
  type: number;
}

// Clan bot configuration
export interface ClanBotConfig {
  bottoken?: string;
  botprefix?: string;
  botchannelid?: string;
  botguildid?: string;
  botenabled?: boolean;
}

export type Clan = {
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
