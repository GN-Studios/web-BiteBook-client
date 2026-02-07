export type RecipeCreator = {
  name: string;
};

export type Ingredient = {
  amount: string; // e.g. "2 cups"
  name: string; // e.g. "Flour"
};

export type Recipe = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;

  creator: RecipeCreator;

  prepMinutes: number;
  cookMinutes: number;
  servings: number;

  likes: number;
  tags?: string[];
  commentsCount?: number;

  ingredients: Ingredient[];
  steps: string[];
};

export type NewRecipeInput = {
  title: string;
  description: string;
  imageUrl?: string;

  prepMinutes: number;
  cookMinutes: number;
  servings: number;

  ingredients: Ingredient[];
  steps: string[];
};
