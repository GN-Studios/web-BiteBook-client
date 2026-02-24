import type { Recipe } from "../../types";

export type SearchHistoryItem = {
  id: string;
  query: string;
  recipes: Recipe[];
  timestamp: number;
};

export type AppState = {
  recipes: Recipe[];
  likedIds: Set<string>;
  myRecipeIds: Set<string>;
  featuredRecipeId: string;
  searchHistory: SearchHistoryItem[];
};

export type AppAction =
  | { type: "TOGGLE_LIKE"; recipeId: string }
  | { type: "ADD_RECIPE"; recipe: Recipe; addToMyRecipes?: boolean }
  | { type: "UPDATE_RECIPE"; recipe: Recipe }
  | { type: "DELETE_RECIPE"; recipeId: string }
  | { type: "SET_FEATURED"; recipeId: string }
  | { type: "ADD_SEARCH_HISTORY"; item: SearchHistoryItem }
  | { type: "CLEAR_SEARCH_HISTORY" };
