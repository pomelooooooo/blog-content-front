"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import Cookies from "js-cookie";
import { auth as authApi } from "./api";
import type { Admin } from "@/types";

interface AuthContextType {
  admin: Admin | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    try {
      const profile = await authApi.profile();
      setAdmin(profile);
    } catch {
      Cookies.remove("token");
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [fetchProfile]);

  const login = async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    Cookies.set("token", res.accessToken, { expires: 7 });
    await fetchProfile();
  };

  const logout = () => {
    Cookies.remove("token");
    setAdmin(null);
  };

  return (
    <AuthContext.Provider
      value={{ admin, loading, login, logout, isAuthenticated: !!admin }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
