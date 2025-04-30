export enum Rarity {
  Common = "Common",
  Uncommon = "Uncommon",
  Rare = "Rare",
  Epic = "Epic",
  Legendary = "Legendary",
}

export type ItemIngredient = {
  ingredients?: ItemIngredient[];
  name: string;
  count: number;
  category?: string;
};

export type ItemRecipe = {
  ingredients: ItemIngredient[];
  output?: number;
  station?: string;
  time?: number;
};

export type ProjectileDamage = {
  damage?: number;
  effectivenessVsSoak?: number;
  effectivenessVsReduce?: number;
};

export type ArmorInfo = {
  absorbing?: number;
  reduction?: number;
};

export type StructureInfo = {
  type?: string;
  hp?: number;
};

export type Cost = {
  name?: string;
  count?: number;
};

export type Drop = {
  name: string;
  chance?: number;
  minQuantity?: number;
  maxQuantity?: number;
  tier?: string;
};

export type WeaponInfo = {
  weaponLength?: number;
  damage?: number;
  penetration?: number;
};

export type ToolInfo = {
  toolType?: string;
  tier?: number;
};

export type ModuleInfo = {
  max?: number;
  increase?: number;
  maxIncrease?: number;
};

export type TechItem = {
  name: string;
  parent: string;
  unlocks?: string[];
  level?: number;
  pointsCost?: number;
  onlyDevs?: boolean;
};

export type WalkerInfo = {
  carryCapacity?: number;
  category?: string;
};

export type ItemCompleteInfo = {
  name: string;
  category?: string;
  crafting?: ItemRecipe[];
  description?: string;
  parent?: string;
  trade_price?: number;
  projectileDamage?: ProjectileDamage;
  stackSize?: number;
  weight?: number;
  experiencieReward?: number;
  durability?: number;
  structureInfo?: StructureInfo;
  toolInfo?: ToolInfo[];
  moduleInfo?: ModuleInfo;
  armorInfo?: ArmorInfo;
  weaponInfo?: WeaponInfo;
  droppedBy?: Drop[];
  cost?: Cost;
  wikiVisibility?: boolean;
  learn?: string[];
  drops?: Drop[];
  upgradeInfo?: any;
  walkerInfo?: WalkerInfo;
};

export type Item = {
  name: string;
  category?: string;
  crafting?: ItemRecipe[];
};

export type CraftItem = Item & { count: number };
