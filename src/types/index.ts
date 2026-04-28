import type { ItemRecipe, RarityTierEnum } from "./item";

export interface CustomItem {
  name: string;
  category?: string;
  count?: number;
  crafting?: ItemRecipe[];
  ingredients?: ItemRecipe[];
  value?: number;
  rarity?: RarityTierEnum;
}

export interface Ingredient {
  name: string;
  count: number;
  category?: string;
  rarity?: RarityTierEnum;
  ingredients?: Ingredient[];
  output?: number;
  station?: string;
  time?: number;
}

export interface Language {
  key: string;
  name: string;
}
