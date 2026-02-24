import type { AppAction, AppState } from "./storeTypes";

export const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case "TOGGLE_LIKE": {
      const likedIds = new Set(state.likedIds);
      if (likedIds.has(action.recipeId)) likedIds.delete(action.recipeId);
      else likedIds.add(action.recipeId);
      return { ...state, likedIds };
    }

    case "ADD_RECIPE": {
      const recipes = [action.recipe, ...state.recipes];
      const myRecipeIds = new Set(state.myRecipeIds);
      if (action.addToMyRecipes ?? true) myRecipeIds.add(action.recipe.id);
      return { ...state, recipes, myRecipeIds };
    }

    case "UPDATE_RECIPE": {
      return {
        ...state,
        recipes: state.recipes.map((r) => (r.id === action.recipe.id ? action.recipe : r)),
      };
    }

    case "DELETE_RECIPE": {
      const nextRecipes = state.recipes.filter((r) => r.id !== action.recipeId);

      // if deleted recipe was featured, fallback to first recipe (or keep undefined)
      const nextFeatured =
        state.featuredRecipeId === action.recipeId ? (nextRecipes[0]?.id ?? "") : state.featuredRecipeId;

      // also remove from liked
      const nextLiked = new Set(state.likedIds);
      nextLiked.delete(action.recipeId);

      return {
        ...state,
        recipes: nextRecipes,
        featuredRecipeId: nextFeatured,
        likedIds: nextLiked,
      };
    }

    case "SET_FEATURED":
      return { ...state, featuredRecipeId: action.recipeId };

    case "ADD_SEARCH_HISTORY":
      return {
        ...state,
        searchHistory: [action.item, ...state.searchHistory],
      };

    case "CLEAR_SEARCH_HISTORY":
      return { ...state, searchHistory: [] };

    default: {
      const _exhaustive: never = action;
      return state;
    }
  }
};
