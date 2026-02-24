import { api } from "./client";
import { getStoredUser, getToken, parseJwtPayload } from "../app/auth";
import type { Recipe } from "../types";

type ServerLike = {
  _id: string;
  userId: string;
  recipeId: string;
  createdAt: string;
};

type RecipeWithLikeInfo = {
  _id: string;
  title: string;
  description: string;
  image?: string | null;
  prepTime: number;
  cookTime: number;
  servings: number;
  ingredients: Array<{ amount: string; name: string }>;
  instructions: string[];
  userId?: string;
  author?: any;
  commentsCount?: number;
  likesCount?: number;
};

const getCurrentUserId = (): string => {
  const stored = getStoredUser() as { _id?: string } | null;
  if (stored?._id) return stored._id;
  const payload = parseJwtPayload(getToken());
  if (payload?.id) return String(payload.id);
  throw new Error("Missing user id");
};

const toClientRecipe = (recipe: RecipeWithLikeInfo): Recipe => {
  const creatorName = recipe.author?.name ?? recipe.author?.username ?? "Unknown";
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

export const addLike = async (recipeId: string): Promise<void> => {
  const userId = getCurrentUserId();
  await api.post("/likes", { userId, recipeId });
};

export const removeLike = async (recipeId: string): Promise<void> => {
  const userId = getCurrentUserId();
  await api.delete("/likes", { data: { userId, recipeId } });
};

export const getLikesByUser = async (userId: string): Promise<Recipe[]> => {
  const res = await api.get<Array<{ _id: string; recipeId: RecipeWithLikeInfo }>>(
    `/likes/user/${userId}`,
  );
  return res.data
    .map((like) => (typeof like.recipeId === "object" ? like.recipeId : null))
    .filter(Boolean)
    .map(toClientRecipe) as Recipe[];
};

export const checkUserLike = async (recipeId: string): Promise<boolean> => {
  try {
    const userId = getCurrentUserId();
    const res = await api.get<{ liked: boolean }>(`/likes/check/${userId}/${recipeId}`);
    return res.data.liked;
  } catch {
    return false;
  }
};
