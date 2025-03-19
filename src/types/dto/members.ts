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
