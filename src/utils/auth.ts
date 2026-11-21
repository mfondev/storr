import type { AxiosResponse } from "axios";
import { AxiosError } from "axios";
import * as SecureStore from "expo-secure-store";
import { authInstance, axiosInstance } from "./api";
import type { AuthResponse, AuthUser, LoginInput, RegisterInput } from "./types";

const USER_KEY = "user";

const registerUser = async (data: RegisterInput): Promise<AuthResponse> => {
  try {
    const response: AxiosResponse = await authInstance.post(
      "/auth/register",
      data,
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message ||
          "An error occurred during registration.",
      );
    } else {
      throw new Error("An unexpected error occurred.");
    }
  }
};

const loginUser = async (data: LoginInput): Promise<AuthResponse> => {
  try {
    const response: AxiosResponse = await authInstance.post(
      "/auth/login",
      data,
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "An error occurred during login.",
      );
    } else {
      throw new Error("An unexpected error occurred.");
    }
  }
};

/** Exchange a Google ID token for our own session (JWT + user). */
const googleSignIn = async (idToken: string): Promise<AuthResponse> => {
  try {
    const response: AxiosResponse = await authInstance.post("/auth/google", {
      idToken,
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message ||
          "Could not sign in with Google. Please try again.",
      );
    } else {
      throw new Error("An unexpected error occurred.");
    }
  }
};

async function save(key: string, value: string) {
  await SecureStore.setItemAsync(key, value);
}

/** Read the signed-in user saved at login; null if none is stored. */
async function getUser(): Promise<AuthUser | null> {
  try {
    const stored = await SecureStore.getItemAsync(USER_KEY);
    return stored ? (JSON.parse(stored) as AuthUser) : null;
  } catch {
    return null;
  }
}

/** Thrown when the token is rejected (expired/invalid) — the session is over. */
export class SessionExpiredError extends Error {}

/** Fetch the current user from the backend using the stored token. */
const getCurrentUser = async (): Promise<AuthUser> => {
  try {
    const response: AxiosResponse = await axiosInstance.get("/auth/me");
    return response.data.data.user;
  } catch (error) {
    if (error instanceof AxiosError) {
      const status = error.response?.status;
      if (status === 401 || status === 403) {
        throw new SessionExpiredError("Your session has expired.");
      }
      throw new Error(
        error.response?.data?.message || "Could not load your profile.",
      );
    } else {
      throw new Error("An unexpected error occurred.");
    }
  }
};

export { registerUser, loginUser, googleSignIn, save, getUser, getCurrentUser };
