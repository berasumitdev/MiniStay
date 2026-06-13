"use client";

import Link from "next/link";
import { useRooms } from "@/hooks/useRooms";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: rooms } = useRooms();

  const available = rooms?.filter((r) => r.status === "AVAILABLE").length ?? 0;
  const occupied = rooms?.filter((r) => r.status === "OCCUPIED").length ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Welcome, {user?.name}</h1>
        <p className="text-sm text-gray-500">Here&apos;s a quick overview.</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Total rooms" value={rooms?.length ?? 0} />
        <StatCard label="Available" value={available} />
        <StatCard label="Occupied" value={occupied} />
      </div>

      <Link
        href="/dashboard/rooms"
        className="text-blue-600 text-sm hover:underline"
      >
        Manage rooms →
      </Link>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-3xl font-semibold mt-1">{value}</div>
    </div>
  );
}
