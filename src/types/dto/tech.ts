export enum Tree {
  VITAMINS = "Vitamins",
  EQUIPMENT = "Equipment",
  CONSTRUCTION = "Construction",
  CRAFTING = "Crafting",
  WALKERS = "Walkers",
}

export type SeeWhoHasLearntItRequestParams = {
  tree: Tree;
  tech: string;
};

export type TechUserInfo = {
  discordtag: string;
};

export type TechTreeInfo = {
  discordtag: string;
  Vitamins: string[];
  Equipment: string[];
  Crafting: string[];
  Construction: string[];
  Walkers: string[];
};
