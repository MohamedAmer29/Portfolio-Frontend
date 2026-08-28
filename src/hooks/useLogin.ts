import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { api } from "../lib/api";
import { extractAccessToken } from "../lib/auth";
import { useAuth } from "./useAuth";

export type LoginFormData = {
  email: string;
  password: string;
};

export function useLogin() {
  const { setAuth } = useAuth();

  return useMutation({
    mutationFn: async (credentials: LoginFormData) => {
      const { data } = await api.post("auth/login", credentials);
      const accessToken = extractAccessToken(data);

      if (!accessToken) {
        throw new Error("Login succeeded but no access token was returned.");
      }

      return accessToken;
    },
    onSuccess: (accessToken) => {
      setAuth(accessToken);
    },
  });
}

export function getLoginErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const data = error.response?.data;

    if (typeof data === "string" && data.trim()) {
      return data;
    }

    if (data && typeof data === "object") {
      const record = data as Record<string, unknown>;
      const message =
        record.message ??
        record.error ??
        (Array.isArray(record.errors) ? record.errors[0] : null);

      if (typeof message === "string" && message.trim()) {
        return message;
      }
    }

    if (error.response?.status === 401) {
      return "Invalid email or password.";
    }

    if (error.response?.status === 400) {
      return "Please check your email and password.";
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Unable to sign in right now. Please try again.";
}
