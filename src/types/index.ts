// Common type definitions for the project

// Item type definition
export interface Item {
  name: string;
  category?: string;
  count?: number;
  crafting?: Crafting[];
  ingredients?: Ingredient[];
  value?: number;
}

// Crafting type definition
export interface Crafting {
  ingredients: Ingredient[];
  output?: number;
  time?: number;
  station?: string;
}

// Ingredient type definition
export interface Ingredient {
  name: string;
  count: number;
  category?: string;
  ingredients?: Ingredient[];
}

// Language type definition
export interface Language {
  key: string;
  name: string;
}
