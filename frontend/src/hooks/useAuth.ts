"use client";

import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCredentials, logout as logoutAction } from "@/store/authSlice";
import { authApi } from "@/lib/api/auth";
import type { Role } from "@/types";

export function useAuth() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, token } = useAppSelector((s) => s.auth);

  const login = async (username: string, role: Role) => {
    const result = await authApi.login(username, role);
    dispatch(setCredentials({ user: result.user, token: result.token }));
    router.push("/dashboard");
  };

  const logout = () => {
    dispatch(logoutAction());
    router.push("/login");
  };

  return {
    user,
    token,
    isAuthenticated: !!token,
    isAdmin: user?.role === "ADMIN",
    login,
    logout,
  };
}
