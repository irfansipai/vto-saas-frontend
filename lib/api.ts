// frontend/lib/api.ts
import axios, { AxiosError, AxiosHeaders } from "axios";

// Create a custom axios instance connected to FastAPI backend
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const TOKEN_STORAGE_KEY = "token";

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = window.localStorage.getItem(TOKEN_STORAGE_KEY);

      if (token) {
        if (!config.headers) {
          config.headers = new AxiosHeaders();
        }

        config.headers.set("Authorization", `Bearer ${token}`);
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.error("API error:", error);

    if (
      error.response?.status === 401 &&
      typeof window !== "undefined"
    ) {
      window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    }

    return Promise.reject(error);
  }
);
