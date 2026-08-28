import { api } from "./api";
import { extractAccessToken } from "./auth";

export async function refreshSession(): Promise<string> {
  const { data } = await api.post("auth/refresh");
  const accessToken = extractAccessToken(data);

  if (!accessToken) {
    throw new Error("No access token received from refresh.");
  }

  return accessToken;
}

export async function logoutSession(): Promise<void> {
  await api.post("auth/logout");
}