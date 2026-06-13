"use client";

import { useState } from "react";
import {
  useRooms,
  useCreateRoom,
  useDeleteRoom,
  useUpdateRoomStatus,
} from "@/hooks/useRooms";
import { useAuth } from "@/hooks/useAuth";
import { Button, Badge, Spinner, ErrorBox } from "@/components/ui";
import { getApiErrorMessage } from "@/lib/axios";
import type { RoomRequest, RoomStatus, RoomType } from "@/types";

const ROOM_TYPES: RoomType[] = [
  "SINGLE",
  "DOUBLE",
  "TWIN",
  "SUITE",
  "DELUXE",
  "PRESIDENTIAL",
];
const STATUS_COLOR: Record<RoomStatus, string> = {
  AVAILABLE: "green",
  OCCUPIED: "blue",
  MAINTENANCE: "amber",
  RESERVED: "gray",
};

export default function RoomsPage() {
  const { isAdmin } = useAuth();
  const { data: rooms, isLoading, isError, error } = useRooms();
  const createRoom = useCreateRoom();
  const deleteRoom = useDeleteRoom();
  const updateStatus = useUpdateRoomStatus();

  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState("");

  const [form, setForm] = useState<RoomRequest>({
    roomNumber: "",
    roomType: "SINGLE",
    floor: 1,
    pricePerNight: 2500,
    capacity: 1,
    description: "",
  });

  const handleCreate = async () => {
    setFormError("");
    try {
      await createRoom.mutateAsync(form);
      setShowForm(false);
      setForm({
        roomNumber: "",
        roomType: "SINGLE",
        floor: 1,
        pricePerNight: 2500,
        capacity: 1,
        description: "",
      });
    } catch (e) {
      setFormError(getApiErrorMessage(e));
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this room?")) return;
    await deleteRoom.mutateAsync(id);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Rooms</h1>
        {isAdmin && (
          <Button onClick={() => setShowForm((s) => !s)}>
            {showForm ? "Cancel" : "+ Add room"}
          </Button>
        )}
      </div>

      {showForm && isAdmin && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
          {formError && <ErrorBox message={formError} />}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Room number">
              <input
                className="input"
                value={form.roomNumber}
                onChange={(e) =>
                  setForm({ ...form, roomNumber: e.target.value })
                }
              />
            </Field>
            <Field label="Type">
              <select
                className="input"
                value={form.roomType}
                onChange={(e) =>
                  setForm({ ...form, roomType: e.target.value as RoomType })
                }
              >
                {ROOM_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Floor">
              <input
                type="number"
                className="input"
                value={form.floor}
                onChange={(e) =>
                  setForm({ ...form, floor: Number(e.target.value) })
                }
              />
            </Field>
            <Field label="Price / night">
              <input
                type="number"
                className="input"
                value={form.pricePerNight}
                onChange={(e) =>
                  setForm({ ...form, pricePerNight: Number(e.target.value) })
                }
              />
            </Field>
            <Field label="Capacity">
              <input
                type="number"
                className="input"
                value={form.capacity}
                onChange={(e) =>
                  setForm({ ...form, capacity: Number(e.target.value) })
                }
              />
            </Field>
            <Field label="Description">
              <input
                className="input"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </Field>
          </div>
          <Button onClick={handleCreate} disabled={createRoom.isPending}>
            {createRoom.isPending ? "Saving…" : "Save room"}
          </Button>
        </div>
      )}

      {isLoading && <Spinner />}
      {isError && <ErrorBox message={getApiErrorMessage(error)} />}

      {rooms && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-500">
              <tr>
                <th className="px-4 py-2">Room</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Floor</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Status</th>
                {isAdmin && <th className="px-4 py-2">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room.id} className="border-t border-gray-100">
                  <td className="px-4 py-2 font-medium">{room.roomNumber}</td>
                  <td className="px-4 py-2">{room.roomType}</td>
                  <td className="px-4 py-2">{room.floor}</td>
                  <td className="px-4 py-2">₹{room.pricePerNight}</td>
                  <td className="px-4 py-2">
                    {isAdmin ? (
                      <select
                        className="text-xs border border-gray-200 rounded px-1 py-0.5"
                        value={room.status}
                        onChange={(e) =>
                          updateStatus.mutate({
                            id: room.id,
                            status: e.target.value as RoomStatus,
                          })
                        }
                      >
                        {(Object.keys(STATUS_COLOR) as RoomStatus[]).map(
                          (s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ),
                        )}
                      </select>
                    ) : (
                      <Badge color={STATUS_COLOR[room.status]}>
                        {room.status}
                      </Badge>
                    )}
                  </td>
                  {isAdmin && (
                    <td className="px-4 py-2">
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(room.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  )}
                </tr>
              ))}
              {rooms.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-gray-400"
                  >
                    No rooms yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="space-y-1 block">
      <span className="text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}
