export enum Languages {
  EN = "en",
  ES = "es",
  RU = "ru",
  FR = "fr",
  DE = "de",
}

export type DiscordConfig = {
  discordid: string;
  botLanguaje: Languages;
  readClanLog: boolean;
  automaticKick: boolean;
  setNotReadyPVP: boolean;
  walkerAlarm: boolean;
};

export type UpdateBotConfigParams = {
  languaje?: Languages;
  clanlog?: boolean;
  kick?: boolean;
  readypvp?: boolean;
  walkeralarm?: boolean;
};
