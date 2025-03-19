// Type definitions for clan-related data

// Clan data structure
export interface Clan {
  clanid: string;
  name: string;
  symbol?: string;
  flagcolor: string;
  region: string;
  discordTag: string;
  invitelink: string;
  recruit?: boolean;
}

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
