import { api } from "./client";
import { getStoredUser, getToken, parseJwtPayload } from "../app/auth";
import type { NewRecipeInput, Recipe } from "../types";

type ServerUser = {
  _id: string;
  username?: string;
  name?: string;
  email?: string;
  image?: string | null;
};

type ServerIngredient = {
  amount: string;
  name: string;
};

type ServerRecipe = {
  _id: string;
  title: string;
  description: string;
  image?: string | null;
  prepTime: number;
  cookTime: number;
  servings: number;
  ingredients: ServerIngredient[];
  instructions: string[];
  userId?: string | ServerUser;
  author?: ServerUser | null;
  commentsCount?: number;
  likesCount?: number;
};

export type RecipesPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type RecipesPage = {
  data: Recipe[];
  pagination: RecipesPagination;
};

const getCurrentUserId = (): string => {
  const stored = getStoredUser() as { _id?: string } | null;
  if (stored?._id) return stored._id;
  const payload = parseJwtPayload(getToken());
  if (payload?.id) return String(payload.id);
  throw new Error("Missing user id");
};

const toClientRecipe = (recipe: ServerRecipe): Recipe => {
  const userObj =
    recipe.author ?? (typeof recipe.userId === "object" ? recipe.userId : null);
  const creatorName = userObj?.name ?? userObj?.username ?? "Unknown";

  return {
    id: recipe._id,
    title: recipe.title,
    description: recipe.description,
    imageUrl: recipe.image ?? undefined,
    creator: { name: creatorName },
    prepMinutes: recipe.prepTime ?? 0,
    cookMinutes: recipe.cookTime ?? 0,
    servings: recipe.servings ?? 1,
    likes: recipe.likesCount ?? 0,
    commentsCount: recipe.commentsCount ?? 0,
    ingredients: (recipe.ingredients ?? []).map((i) => ({ amount: i.amount, name: i.name })),
    steps: recipe.instructions ?? [],
  };
};

const toServerCreatePayload = (input: NewRecipeInput) => {
  return {
    title: input.title,
    description: input.description,
    image: input.imageUrl,
    prepTime: input.prepMinutes,
    cookTime: input.cookMinutes,
    servings: input.servings,
    ingredients: input.ingredients,
    instructions: input.steps,
    userId: getCurrentUserId(),
  };
};

const toServerUpdatePayload = (recipe: Partial<Recipe>) => {
  return {
    title: recipe.title,
    description: recipe.description,
    image: recipe.imageUrl,
    prepTime: recipe.prepMinutes,
    cookTime: recipe.cookMinutes,
    servings: recipe.servings,
    ingredients: recipe.ingredients,
    instructions: recipe.steps,
  };
};

export const getRecipes = async (): Promise<Recipe[]> => {
  const page = await getRecipesPage(1, 12);
  return page.data;
};

export const getRecipesPage = async (page = 1, limit = 12): Promise<RecipesPage> => {
  const res = await api.get<{ data: ServerRecipe[]; pagination: RecipesPagination }>("/recipes/with-details", {
    params: { page, limit },
  });
  return {
    data: res.data.data.map(toClientRecipe),
    pagination: res.data.pagination,
  };
};

export const getRecipe = async (id: string): Promise<Recipe> => {
  const res = await api.get<ServerRecipe>(`/recipes/${id}`);
  return toClientRecipe(res.data);
};

export const createRecipe = async (payload: NewRecipeInput): Promise<Recipe> => {
  const res = await api.post<{ message: string; recipe: ServerRecipe }>(`/recipes`, toServerCreatePayload(payload));
  return toClientRecipe(res.data.recipe);
};

export const updateRecipe = async (id: string, payload: Partial<Recipe>): Promise<Recipe> => {
  const res = await api.put<{ message: string; recipe: ServerRecipe }>(`/recipes/${id}`, toServerUpdatePayload(payload));
  return toClientRecipe(res.data.recipe);
};

export const deleteRecipe = async (id: string): Promise<void> => {
  await api.delete(`/recipes/${id}`);
};

export const getUserRecipes = async (id: string): Promise<Recipe[]> => {
  const res = await api.get<ServerRecipe[]>(`/recipes/userRecipes/${id}`);
  return res.data.map(toClientRecipe);
};
