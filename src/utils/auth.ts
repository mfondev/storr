import type { AxiosResponse } from "axios";
import { AxiosError } from "axios";
import * as SecureStore from "expo-secure-store";
import { authInstance } from "./api";
import type { AuthResponse, LoginInput, RegisterInput } from "./types";

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

async function save(key: string, value: string) {
  await SecureStore.setItemAsync(key, value);
}

export { registerUser, loginUser, save };
