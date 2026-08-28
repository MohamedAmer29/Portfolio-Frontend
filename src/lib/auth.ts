export const AUTH_QUERY_KEY = ["auth"] as const;
export const AUTH_STORAGE_KEY = "portfolio_admin_auth";
export const TOKEN_TTL_MS = 15 * 60 * 1000;
export const SESSION_EXTEND_THRESHOLD_MS = 3 * 60 * 1000;

export type AuthState = {
  accessToken: string;
  expiresAt: number;
};

export function readStoredAuth(): AuthState | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as AuthState;
    if (!parsed.accessToken || !parsed.expiresAt) return null;
    if (parsed.expiresAt <= Date.now()) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }

    return parsed;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export function persistAuth(accessToken: string): AuthState {
  const auth: AuthState = {
    accessToken,
    expiresAt: Date.now() + TOKEN_TTL_MS,
  };
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
  return auth;
}

export function clearStoredAuth(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function notifyUnauthorized(): void {
  clearStoredAuth();
  window.dispatchEvent(new CustomEvent("auth:unauthorized"));
}

export function extractAccessToken(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;

  const record = data as Record<string, unknown>;
  const token =
    record.accessToken ??
    record.access_token ??
    record.token ??
    (typeof record.data === "object" && record.data
      ? (record.data as Record<string, unknown>).accessToken ??
        (record.data as Record<string, unknown>).access_token ??
        (record.data as Record<string, unknown>).token
      : null);

  return typeof token === "string" && token.length > 0 ? token : null;
}
