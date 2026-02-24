import { api } from "./client";

type User = {
  _id: string;
  username: string;
  name: string;
  email: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
};

export const getAllUsers = async () => {
  const res = await api.get<User[]>("/users");
  return res.data;
};

export const getUserById = async (id: string) => {
  const res = await api.get<User>(`/users/${id}`);
  return res.data;
};

export const updateUser = async (
  id: string,
  payload: { username?: string; name?: string; email?: string; password?: string; image?: string },
) => {
  const res = await api.put<{ message: string; user: User }>(`/users/${id}`, payload);
  return res.data;
};

export const deleteUser = async (id: string) => {
  const res = await api.delete<{ message: string }>(`/users/${id}`);
  return res.data;
};
