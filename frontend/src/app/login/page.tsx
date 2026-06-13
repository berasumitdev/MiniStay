"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button, ErrorBox } from "@/components/ui";
import type { Role } from "@/types";

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [role, setRole] = useState<Role>("ADMIN");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      await login(username, role);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <div>
          <h1 className="text-xl font-semibold">MiniStay</h1>
          <p className="text-sm text-gray-500">Sign in to continue</p>
        </div>

        {error && <ErrorBox message={error} />}

        <div className="space-y-1">
          <label className="text-sm font-medium">Username</label>
          <input
            className="input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter any name"
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Role (mock)</label>
          <select
            className="input"
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
          >
            <option value="ADMIN">Admin (full access)</option>
            <option value="STAFF">Staff (view only)</option>
          </select>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full px-3 py-2 rounded text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>

        <p className="text-xs text-gray-400 text-center">
          Mock login — no password needed. Real auth comes later.
        </p>
      </div>
    </div>
  );
}
