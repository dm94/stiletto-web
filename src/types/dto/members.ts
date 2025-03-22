export enum MemberAction {
  OWNER = "owner",
  KICK = "kick",
}

export type UpdateMemberPermissionsQueryParams = {
  request: boolean;
  kickmembers: boolean;
  walkers: boolean;
  bot: boolean;
  diplomacy: boolean;
};

export type MemberPermissions = {
  bot: boolean;
  diplomacy: boolean;
  kickmembers: boolean;
  request: boolean;
  walkers: boolean;
};

export type Permissions = {
  clanid: number;
  discordid: string;
  request: boolean;
  kickmembers: boolean;
  walkers: boolean;
  bot: boolean;
  diplomacy: boolean;
};

export interface PermissionsResponse {
  success: boolean;
  data?: Permissions;
  error?: string;
}

export type MemberRequest = {
  discordid: string;
  nickname?: string;
  discordtag: string;
  leaderid: string;
  message?: string;
};

export type MemberInfo = {
  discordid: string;
  nickname?: string;
  discordtag: string;
  leaderid: string;
};
