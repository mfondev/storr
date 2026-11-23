import axios from "axios";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";

// A physical phone (and Expo Go) can't reach "localhost" — that's the device
// itself. Derive the dev machine's LAN host from the Metro URL the app already
// loaded from (e.g. "192.168.1.3:8081" -> "192.168.1.3"). Order of preference:
//   1. EXPO_PUBLIC_API_URL  — an explicit override / production backend.
//   2. the Metro host        — works automatically in Expo Go on device + simulator.
//   3. localhost             — last resort (web / simulator).
const metroHost = Constants.expoConfig?.hostUri?.split(":")[0];
const base_url =
  process.env.EXPO_PUBLIC_API_URL?.trim() ||
  (metroHost ? `http://${metroHost}:3000` : "http://localhost:3000");

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
