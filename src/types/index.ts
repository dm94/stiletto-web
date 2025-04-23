import type { ItemRecipe } from "./item";

export interface CustomItem {
  name: string;
  category?: string;
  count?: number;
  crafting?: ItemRecipe[];
  ingredients?: Ingredient[];
  value?: number;
}

export interface Ingredient {
  name: string;
  count: number;
  category?: string;
  ingredients?: Ingredient[];
  output?: number;
}

export interface Language {
  key: string;
  name: string;
}
