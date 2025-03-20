import type { ItemRecipe } from "./item";

// Item type definition
export interface CustomItem {
  name: string;
  category?: string;
  count: number;
  crafting?: ItemRecipe[];
  ingredients?: Ingredient[];
  value?: number;
}

// Ingredient type definition
export interface Ingredient {
  name: string;
  count: number;
  category?: string;
  ingredients?: Ingredient[];
  output?: number;
}

// Language type definition
export interface Language {
  key: string;
  name: string;
}
