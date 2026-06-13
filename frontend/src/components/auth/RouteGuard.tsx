"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import type { Role } from "@/types";

interface RouteGuardProps {
  children: ReactNode;
  allowedRoles?: Role[];
}

export default function RouteGuard({
  children,
  allowedRoles,
}: RouteGuardProps) {
  const router = useRouter();
  const { user, token } = useAppSelector((s) => s.auth);

  const isAuthed = !!token;
  const roleAllowed =
    !allowedRoles || (user && allowedRoles.includes(user.role));

  useEffect(() => {
    if (!isAuthed) {
      router.replace("/login");
    } else if (!roleAllowed) {
      router.replace("/dashboard");
    }
  }, [isAuthed, roleAllowed, router]);

  if (!isAuthed || !roleAllowed) return null;

  return <>{children}</>;
}
