import { api } from "./client";

type AuthResponse = {
  user: Record<string, any>;
  token: string;
};

export const register = async (payload: { username: string; email: string; password: string; image?: string }) => {
  const res = await api.post<AuthResponse>(`/auth/register`, payload);
  return res.data;
};

export const login = async (payload: { username: string; password: string }) => {
  const res = await api.post<AuthResponse>(`/auth/login`, payload);
  return res.data;
};

export const googleLogin = async (credential: string) => {
  const res = await api.post<AuthResponse>(`/auth/google`, { credential });
  return res.data;
};
