import { api } from "./client";

type AuthResponse = {
  user: Record<string, any>;
  token: string;
};

export const register = async (payload: { name: string; email: string; password: string; image?: string }) => {
  const res = await api.post<AuthResponse>(`/auth/register`, payload);
  return res.data;
};

export const login = async (payload: { email: string; password: string }) => {
  const res = await api.post<AuthResponse>(`/auth/login`, payload);
  return res.data;
};
