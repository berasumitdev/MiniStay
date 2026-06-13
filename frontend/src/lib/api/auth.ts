import type { AuthUser, Role } from "@/types";

export interface LoginResult {
  token: string;
  user: AuthUser;
}

export const authApi = {
  login: async (username: string, role: Role): Promise<LoginResult> => {
    await new Promise((r) => setTimeout(r, 400));

    if (!username.trim()) {
      throw new Error("Username is required");
    }

    const token = `mock-jwt-${role}-${Date.now()}`;
    const user: AuthUser = { name: username.trim(), role };

    return { token, user };
  },
};
