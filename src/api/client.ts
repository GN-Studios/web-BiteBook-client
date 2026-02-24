import axios from "axios";
import { getToken } from "../app/auth";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api",
  headers: { "Content-Type": "application/json" },
});

// attach token automatically to all requests
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers ?? {};
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
