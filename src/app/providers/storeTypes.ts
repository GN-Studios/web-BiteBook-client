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
  recipesPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
};

export type AppAction =
  | { type: "TOGGLE_LIKE"; recipeId: string }
  | { type: "SET_LIKED_IDS"; likedIds: Set<string> }
  | { type: "LIKE_RECIPE"; recipeId: string }
  | { type: "UNLIKE_RECIPE"; recipeId: string }
  | { type: "ADD_RECIPE"; recipe: Recipe; addToMyRecipes?: boolean }
  | { type: "UPDATE_RECIPE"; recipe: Recipe }
  | { type: "DELETE_RECIPE"; recipeId: string }
  | {
      type: "SET_RECIPES";
      recipes: Recipe[];
    }
  | {
      type: "SET_RECIPES_PAGINATION";
      pagination: AppState["recipesPagination"];
    }
  | { type: "SET_FEATURED"; recipeId: string }
  | { type: "ADD_SEARCH_HISTORY"; item: SearchHistoryItem }
  | { type: "CLEAR_SEARCH_HISTORY" };
