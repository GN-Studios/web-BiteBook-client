import { useCallback, useEffect, useState } from "react";
import * as recipesApi from "../api";
import type { Recipe } from "../types";

export const useRecipes = () => {
  const [data, setData] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const recipes = await recipesApi.getRecipes();
      setData(recipes);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    data,
    loading,
    error,
    refresh: fetch,
    getById: recipesApi.getRecipe,
    create: recipesApi.createRecipe,
    update: recipesApi.updateRecipe,
    remove: recipesApi.deleteRecipe,
  };
};
