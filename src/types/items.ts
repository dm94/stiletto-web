export interface BaseIngredient {
  name: string;
  count: number;
}

export interface Crafting {
  ingredients: BaseIngredient[];
  output?: number;
}

export interface Ingredient extends BaseIngredient {
  ingredients?: Crafting[];
}

export interface Drop {
  location: string;
  chance: number;
  minQuantity?: number;
  maxQuantity?: number;
}

export interface Item extends Ingredient {
  category?: string;
  description?: string;
  quality?: number;
  type?: string;
  weight?: number;
  durability?: number;
  damage?: number;
  protection?: number;
  waterProtection?: number;
  craftingTime?: number;
  craftingStation?: string;
  output?: number;
  learn?: string[];
  cost?: {
    name: string;
    count: number;
  };
  trade_price?: number;
  stackSize?: number;
  experiencieReward?: number;
  parent?: string;
  crafting?: {
    ingredients: Ingredient[];
    output?: number;
  }[];
  drops?: Drop[];
} 