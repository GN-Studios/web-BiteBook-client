import React, { useEffect, useMemo, useReducer } from "react";
import { getRecipesPage } from "../../api";
import { AppStoreContext } from "./store";
import { appReducer } from "./appReducer";
import type { AppState } from "./storeTypes";

const initialState: AppState = {
  recipes: [],
  likedIds: new Set<string>(),
  myRecipeIds: new Set<string>(),
  featuredRecipeId: "",
  searchHistory: [],
  recipesPagination: {
    page: 1,
    limit: 3,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },
};

export const AppStoreProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const page = await getRecipesPage(1, 3);
        if (!mounted) return;
        dispatch({ type: "SET_RECIPES", recipes: page.data });
        dispatch({
          type: "SET_RECIPES_PAGINATION",
          pagination: page.pagination,
        });
      } catch (err) {
        console.error("Failed to load recipes from API:", err);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return (
    <AppStoreContext.Provider value={value}>
      {children}
    </AppStoreContext.Provider>
  );
};
