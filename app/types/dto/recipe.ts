export type Recipe = {
  name: string;
  count: number;
};

export type RecipeListInfo = {
  token: string;
  items: Recipe[];
};
