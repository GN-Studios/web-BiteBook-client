import { api } from "./client";

export type Comment = {
  _id: string;
  text: string;
  userId: {
    _id: string;
    name: string;
    image?: string;
  };
  recipeId: string;
  createdAt: string;
  updatedAt: string;
};

export type CommentInput = {
  text: string;
  userId: string;
  recipeId: string;
};

// Get all comments for a recipe
export const getCommentsByRecipeId = async (
  recipeId: string,
): Promise<Comment[]> => {
  const { data } = await api.get(`/comments/recipe/${recipeId}`);
  return data;
};

// Create a new comment
export const createComment = async (input: CommentInput): Promise<Comment> => {
  const { data } = await api.post("/comments", input);
  return data.comment || data;
};

// Delete a comment
export const deleteComment = async (commentId: string): Promise<void> => {
  await api.delete(`/comments/${commentId}`);
};

// Update a comment
export const updateComment = async (
  commentId: string,
  text: string,
): Promise<Comment> => {
  const { data } = await api.put(`/comments/${commentId}`, { text });
  return data.comment || data;
};
