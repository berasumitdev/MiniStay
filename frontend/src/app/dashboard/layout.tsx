"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import RouteGuard from "@/components/auth/RouteGuard";
import { useAuth } from "@/hooks/useAuth";
import { Badge, Button } from "@/components/ui";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/rooms", label: "Rooms" },
  { href: "/dashboard/guests", label: "Guests" },
  { href: "/dashboard/bookings", label: "Bookings" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  return (
    <RouteGuard>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <span className="font-semibold">MiniStay</span>
              <nav className="flex gap-1">
                {navItems.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`px-3 py-1.5 rounded text-sm ${
                        active
                          ? "bg-gray-900 text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">{user?.name}</span>
              <Badge color={user?.role === "ADMIN" ? "blue" : "gray"}>
                {user?.role}
              </Badge>
              <Button variant="ghost" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
      </div>
    </RouteGuard>
  );
}
