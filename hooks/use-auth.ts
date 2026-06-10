"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { apiClient } from "@/lib/api-client";
import type { LoginCredentials, RegisterCredentials, User } from "@/types";

export function useAuth() {
  const router = useRouter();
  const {
    setUser,
    logout: storeLogout,
    setLoading,
    setError,
    clearError,
  } = useAuthStore();

  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    clearError();
    try {
      const res = await apiClient.post<{ data: { user: User; token: string } }>(
        "/auth/login",
        credentials,
      );
      setUser(res.data.user, res.data.token);
      router.push("/dashboard");
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error?.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    setLoading(true);
    clearError();
    try {
      const res = await apiClient.post<{ data: { user: User; token: string } }>(
        "/auth/register",
        credentials,
      );
      setUser(res.data.user, res.data.token);
      router.push("/dashboard");
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error?.message ?? "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiClient.post("/auth/logout");
    } finally {
      storeLogout();
      router.push("/login");
    }
  };

  return { login, register, logout };
}
