"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ID, OAuthProvider, type Models } from "appwrite";
import { account } from "@/lib/appwrite";

type AppUser = Models.User<Models.Preferences>;

interface AuthContextValue {
  user: AppUser | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => void;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      setUser(await account.get());
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  const login = useCallback(
    async (email: string, password: string) => {
      // Appwrite refuses a second session in the same browser
      try {
        await account.deleteSession("current");
      } catch {}

      await account.createEmailPasswordSession(email, password);
      await refresh();
    },
    [refresh]
  );

  const signup = useCallback(
    async (name: string, email: string, password: string) => {
      await account.create(ID.unique(), email, password, name);
      await login(email, password);
    },
    [login]
  );

  const loginWithGoogle = useCallback(() => {
    account.createOAuth2Session(
      OAuthProvider.Google,
      `${window.location.origin}/`,
      `${window.location.origin}/login?error=google`
    );
  }, []);

  const logout = useCallback(async () => {
    try {
      await account.deleteSession("current");
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAdmin: Boolean(user?.labels?.includes("admin")),
      login,
      signup,
      loginWithGoogle,
      logout,
      refresh
    }),
    [user, loading, login, signup, loginWithGoogle, logout, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}