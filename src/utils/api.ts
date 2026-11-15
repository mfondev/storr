import axios from "axios";
import * as SecureStore from "expo-secure-store";

const base_url = "http://localhost:3000";

// Authenticated requests (protected routes like /auth/me, /items).
const axiosInstance = axios.create({
  baseURL: base_url,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the stored token so protected routes see `Authorization: Bearer <token>`.
axiosInstance.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Unauthenticated requests (login, register).
const authInstance = axios.create({
  baseURL: base_url,
});

export { axiosInstance, authInstance };
