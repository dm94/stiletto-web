export type UserInfo = {
  nickname?: string;
  discordtag: string;
  discordid: string;
  clanid?: number;
  clanname?: string;
  leaderid?: string;
  serverdiscord?: string;
};

export type LoginInfo = {
  discordid: string;
  token: string;
};
