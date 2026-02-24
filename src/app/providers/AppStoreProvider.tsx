import React, { useEffect, useMemo, useReducer } from "react";
import { getRecipes } from "../../api";
import { AppStoreContext } from "./store";
import { appReducer } from "./appReducer";
import type { AppState } from "./storeTypes";

const initialState: AppState = {
  recipes: [],
  likedIds: new Set<string>(),
  myRecipeIds: new Set<string>(),
  featuredRecipeId: "",
};

export const AppStoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const recipes = await getRecipes();
        if (!mounted) return;
        recipes.forEach((recipe) => dispatch({ type: "ADD_RECIPE", recipe: recipe, addToMyRecipes: false }));
      } catch (err) {
        console.error("Failed to load recipes from API:", err);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
};
