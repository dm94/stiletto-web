export interface CraftingIngredient {
  name: string;
  amount: number;
}

export interface CraftingRecipe {
  ingredients: CraftingIngredient[];
  output?: number;
  station?: string;
  time?: number;
}

export interface ItemData {
  id: string;
  name: string;
  icon: string;
  description?: string;
  category: string;
  count?: number;
  damage?: number;
  crafting?: CraftingRecipe[];
} 