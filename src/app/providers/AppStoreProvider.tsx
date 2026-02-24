import React, { useMemo, useReducer } from "react";
import { mockRecipes } from "../../data/mockRecipes";
import { AppStoreContext } from "./store";
import { appReducer } from "./appReducer";
import type { AppState } from "./storeTypes";

const initialState: AppState = {
  recipes: mockRecipes,
  likedIds: new Set<string>(),
  myRecipeIds: new Set<string>(["margherita", "quinoa-bowl"]),
  featuredRecipeId: "lava-cake",
  searchHistory: [],
};

export const AppStoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
};
