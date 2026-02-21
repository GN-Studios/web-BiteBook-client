import type { Recipe } from "../../types";

export type AppState = {
  recipes: Recipe[];
  likedIds: Set<string>;
  myRecipeIds: Set<string>;
  featuredRecipeId: string;
};

export type AppAction =
  | { type: "TOGGLE_LIKE"; recipeId: string }
  | { type: "ADD_RECIPE"; recipe: Recipe; addToMyRecipes?: boolean }
  | { type: "UPDATE_RECIPE"; recipe: Recipe }
  | { type: "DELETE_RECIPE"; recipeId: string }
  | { type: "SET_FEATURED"; recipeId: string };
