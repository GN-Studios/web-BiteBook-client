import type { AppAction, AppState } from "./storeTypes";

export function appReducer(state: AppState, action: AppAction): AppState {
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

    case "SET_FEATURED":
      return { ...state, featuredRecipeId: action.recipeId };

    default: {
      const _exhaustive: never = action;
      return state;
    }
  }
}
