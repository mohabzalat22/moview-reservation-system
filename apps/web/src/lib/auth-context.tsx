"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { loginApi, registerApi, AuthResult } from "./api";

interface User {
  id: string;
  email: string;
  role: string;
  name?: string;
}

interface AuthContextValue {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const ACCESS_TOKEN_KEY = "mrs_access_token";
const USER_KEY = "mrs_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore auth state from localStorage on mount
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem(ACCESS_TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);
      if (storedToken && storedUser) {
        setAccessToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch {
      // localStorage not available (SSR guard)
    } finally {
      setIsLoading(false);
    }

    const handleRefresh = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      setAccessToken(customEvent.detail);
    };

    const handleLogout = () => {
      logout();
    };

    window.addEventListener("mrs_token_refreshed", handleRefresh);
    window.addEventListener("mrs_logout", handleLogout);

    return () => {
      window.removeEventListener("mrs_token_refreshed", handleRefresh);
      window.removeEventListener("mrs_logout", handleLogout);
    };
  }, []);

  const persist = useCallback((result: AuthResult) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, result.accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(result.user));
    setAccessToken(result.accessToken);
    setUser(result.user);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const result = await loginApi(email, password);
      persist(result);
    },
    [persist]
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const result = await registerApi(name, email, password);
      persist(result);
    },
    [persist]
  );

  const logout = useCallback(async () => {
    try {
      // Attempt to tell the backend to clear the refresh token cookie
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      // Ignore network errors on logout
    }

    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setAccessToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, accessToken, isLoading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
