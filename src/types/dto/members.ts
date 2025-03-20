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

export type Permissions = MemberPermissions & {
  clanid: number;
  discordid: string;
};

export interface PermissionsResponse {
  success: boolean;
  data?: Permissions;
  error?: string;
}

export interface Member {
  discordid: string;
  discordtag: string;
  nickname?: string;
  permissions?: string[];
  leaderid: string;
}

export interface RequestMember extends Member {
  message: string;
}
