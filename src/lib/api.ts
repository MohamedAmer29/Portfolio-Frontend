import axios from "axios";
import { notifyUnauthorized, readStoredAuth } from "./auth";

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const auth = readStoredAuth();
  if (auth) {
    config.headers.Authorization = `Bearer ${auth.accessToken}`;
  }
  if (typeof FormData !== "undefined" && config.data instanceof FormData) {
    config.headers.delete("Content-Type");
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const hadAuth = Boolean(error.config?.headers?.Authorization);
      if (hadAuth) {
        notifyUnauthorized();
      }
    }
    return Promise.reject(error);
  },
);