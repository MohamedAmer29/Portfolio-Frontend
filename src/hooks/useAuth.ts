import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  AUTH_QUERY_KEY,
  SESSION_EXTEND_THRESHOLD_MS,
  clearStoredAuth,
  persistAuth,
  readStoredAuth,
  type AuthState,
} from "../lib/auth";
import { refreshSession, logoutSession } from "../lib/session";

export function useAuth() {
  const queryClient = useQueryClient();
  const [showExtendBanner, setShowExtendBanner] = useState(false);
  const extendingRef = useRef(false);

  const { data: auth = null } = useQuery<AuthState | null>({
    queryKey: AUTH_QUERY_KEY,
    queryFn: readStoredAuth,
    staleTime: Infinity,
    initialData: readStoredAuth,
  });

  const isAdmin = auth !== null && auth.expiresAt > Date.now();

  useEffect(() => {
    const handleUnauthorized = () => {
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, [queryClient]);

  useEffect(() => {
    const clearLocalSession = async () => {
      clearStoredAuth();
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
      setShowExtendBanner(false);
    };

    const expireSession = async () => {
      try {
        await logoutSession();
      } catch {
        // Session is already invalid server-side; still clear locally.
      }
      await clearLocalSession();
    };

    if (!auth) {
      setShowExtendBanner(false);
      return;
    }

    const remaining = auth.expiresAt - Date.now();

    if (remaining <= 0) {
      setShowExtendBanner(false);
      if (!extendingRef.current) {
        void expireSession();
      }
      return;
    }

    const showBannerAt = remaining - SESSION_EXTEND_THRESHOLD_MS;

    if (showBannerAt <= 0) {
      setShowExtendBanner(true);
      const logoutTimer = window.setTimeout(() => {
        if (extendingRef.current) return;
        void expireSession();
      }, remaining);
      return () => window.clearTimeout(logoutTimer);
    }

    const bannerTimer = window.setTimeout(() => {
      setShowExtendBanner(true);
    }, showBannerAt);

    const logoutTimer = window.setTimeout(() => {
      if (extendingRef.current) return;
      void expireSession();
    }, remaining);

    return () => {
      window.clearTimeout(bannerTimer);
      window.clearTimeout(logoutTimer);
    };
  }, [auth, queryClient]);

  const setAuth = (accessToken: string) => {
    const nextAuth = persistAuth(accessToken);
    queryClient.setQueryData(AUTH_QUERY_KEY, nextAuth);
    return nextAuth;
  };

  const extendSession = async () => {
    if (extendingRef.current) return;
    extendingRef.current = true;

    const clearLocalSession = async () => {
      clearStoredAuth();
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
      setShowExtendBanner(false);
    };

    try {
      const newAccessToken = await refreshSession();
      setAuth(newAccessToken);
      setShowExtendBanner(false);
    } catch {
      toast.error("Session could not be extended.");
      logoutSession().catch(() => {}).then(clearLocalSession);
    } finally {
      extendingRef.current = false;
    }
  };

  const logout = () => {
    if (extendingRef.current) return;
    logoutSession()
      .catch(() => {})
      .then(() => {
        clearStoredAuth();
        queryClient.setQueryData(AUTH_QUERY_KEY, null);
        setShowExtendBanner(false);
      });
  };

  return {
    auth,
    isAdmin,
    showExtendBanner,
    extendSession,
    setAuth,
    logout,
  };
}