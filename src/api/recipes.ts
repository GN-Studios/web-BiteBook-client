import { api } from "./client";
import type { Recipe } from "../types";

export const getRecipes = async (): Promise<Recipe[]> => {
  const res = await api.get<Recipe[]>("/recipes");

  return res.data;
};

export const getRecipe = async (id: string): Promise<Recipe> => {
  const res = await api.get<Recipe>(`/recipes/${id}`);

  return res.data;
};

export const createRecipe = async (payload: Partial<Recipe>): Promise<Recipe> => {
  const res = await api.post<Recipe>(`/recipes`, payload);

  return res.data;
};

export const updateRecipe = async (id: string, payload: Partial<Recipe>): Promise<Recipe> => {
  const res = await api.put<Recipe>(`/recipes/${id}`, payload);

  return res.data;
};

export const deleteRecipe = async (id: string): Promise<void> => {
  await api.delete(`/recipes/${id}`);
};

export const getUserRecipes = async (id: string): Promise<Recipe[]> => {
  const res = await api.get<Recipe[]>(`/recipes/userRecipes/${id}`);
  return res.data;
};
