"use client";

import { useState } from "react";
import {
  useBookings,
  useCreateBooking,
  useCheckIn,
  useCheckOut,
  useCancelBooking,
} from "@/hooks/useBookings";
import { useRooms } from "@/hooks/useRooms";
import { useGuests } from "@/hooks/useGuests";
import { bookingsApi } from "@/lib/api/bookings";
import { useAuth } from "@/hooks/useAuth";
import { Button, Badge, Spinner, ErrorBox } from "@/components/ui";
import { getApiErrorMessage } from "@/lib/axios";
import type { BookingRequest, BookingStatus } from "@/types";

const STATUS_COLOR: Record<BookingStatus, string> = {
  CONFIRMED: "blue",
  CHECKED_IN: "green",
  CHECKED_OUT: "gray",
  CANCELLED: "red",
  NO_SHOW: "amber",
};

const EMPTY: BookingRequest = {
  guestId: 0,
  roomId: 0,
  checkIn: "",
  checkOut: "",
  numberOfGuests: 1,
  specialRequests: "",
};

export default function BookingsPage() {
  const { isAdmin } = useAuth();
  const { data: bookings, isLoading, isError, error } = useBookings();
  const { data: rooms } = useRooms();
  const { data: guests } = useGuests();
  const createBooking = useCreateBooking();
  const checkIn = useCheckIn();
  const checkOut = useCheckOut();
  const cancel = useCancelBooking();

  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState<BookingRequest>(EMPTY);
  const [availability, setAvailability] = useState<null | boolean>(null);
  const [checking, setChecking] = useState(false);

  const selectedRoom = rooms?.find((r) => r.id === form.roomId);

  const handleCheckAvailability = async () => {
    setAvailability(null);
    setFormError("");
    if (!form.roomId || !form.checkIn || !form.checkOut) {
      setFormError("Pick a room and both dates first");
      return;
    }
    setChecking(true);
    try {
      const res = await bookingsApi.checkAvailability(
        form.roomId,
        form.checkIn,
        form.checkOut,
      );
      setAvailability(res.available);
    } catch (e) {
      setFormError(getApiErrorMessage(e));
    } finally {
      setChecking(false);
    }
  };

  const handleCreate = async () => {
    setFormError("");
    try {
      await createBooking.mutateAsync({
        ...form,
        pricePerNight: selectedRoom?.pricePerNight,
      });
      setShowForm(false);
      setForm(EMPTY);
      setAvailability(null);
    } catch (e) {
      setFormError(getApiErrorMessage(e));
    }
  };

  const guestName = (id: number) => {
    const g = guests?.find((x) => x.id === id);
    return g ? `${g.firstName} ${g.lastName}` : `#${id}`;
  };

  const roomNumber = (id: number) =>
    rooms?.find((r) => r.id === id)?.roomNumber ?? `#${id}`;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Bookings</h1>
        <Button onClick={() => setShowForm((s) => !s)}>
          {showForm ? "Cancel" : "+ New booking"}
        </Button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
          {formError && <ErrorBox message={formError} />}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Guest">
              <select
                className="input"
                value={form.guestId}
                onChange={(e) => {
                  setForm({ ...form, guestId: Number(e.target.value) });
                  setAvailability(null);
                }}
              >
                <option value={0}>Select guest…</option>
                {guests?.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.firstName} {g.lastName}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Room">
              <select
                className="input"
                value={form.roomId}
                onChange={(e) => {
                  setForm({ ...form, roomId: Number(e.target.value) });
                  setAvailability(null);
                }}
              >
                <option value={0}>Select room…</option>
                {rooms?.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.roomNumber} — {r.roomType} (₹{r.pricePerNight})
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Check-in">
              <input
                type="date"
                className="input"
                value={form.checkIn}
                onChange={(e) => {
                  setForm({ ...form, checkIn: e.target.value });
                  setAvailability(null);
                }}
              />
            </Field>
            <Field label="Check-out">
              <input
                type="date"
                className="input"
                value={form.checkOut}
                onChange={(e) => {
                  setForm({ ...form, checkOut: e.target.value });
                  setAvailability(null);
                }}
              />
            </Field>
            <Field label="Number of guests">
              <input
                type="number"
                min={1}
                className="input"
                value={form.numberOfGuests}
                onChange={(e) =>
                  setForm({ ...form, numberOfGuests: Number(e.target.value) })
                }
              />
            </Field>
            <Field label="Special requests">
              <input
                className="input"
                value={form.specialRequests}
                onChange={(e) =>
                  setForm({ ...form, specialRequests: e.target.value })
                }
              />
            </Field>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={handleCheckAvailability}
              disabled={checking}
            >
              {checking ? "Checking…" : "Check availability"}
            </Button>
            {availability === true && <Badge color="green">Available</Badge>}
            {availability === false && <Badge color="red">Not available</Badge>}
          </div>

          <Button
            onClick={handleCreate}
            disabled={createBooking.isPending || availability === false}
          >
            {createBooking.isPending ? "Booking…" : "Confirm booking"}
          </Button>
        </div>
      )}

      {isLoading && <Spinner />}
      {isError && <ErrorBox message={getApiErrorMessage(error)} />}

      {bookings && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-500">
              <tr>
                <th className="px-4 py-2">Ref</th>
                <th className="px-4 py-2">Guest</th>
                <th className="px-4 py-2">Room</th>
                <th className="px-4 py-2">Dates</th>
                <th className="px-4 py-2">Nights</th>
                <th className="px-4 py-2">Total</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-t border-gray-100">
                  <td className="px-4 py-2 font-mono text-xs">
                    {b.bookingReference}
                  </td>
                  <td className="px-4 py-2">{guestName(b.guestId)}</td>
                  <td className="px-4 py-2">{roomNumber(b.roomId)}</td>
                  <td className="px-4 py-2 text-xs">
                    {b.checkIn} → {b.checkOut}
                  </td>
                  <td className="px-4 py-2">{b.numberOfNights}</td>
                  <td className="px-4 py-2">
                    {b.totalAmount ? `₹${b.totalAmount}` : "—"}
                  </td>
                  <td className="px-4 py-2">
                    <Badge color={STATUS_COLOR[b.status]}>{b.status}</Badge>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex gap-1">
                      {b.status === "CONFIRMED" && (
                        <>
                          <Button onClick={() => checkIn.mutate(b.id)}>
                            Check-in
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => cancel.mutate(b.id)}
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                      {b.status === "CHECKED_IN" && (
                        <Button onClick={() => checkOut.mutate(b.id)}>
                          Check-out
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-gray-400"
                  >
                    No bookings yet.
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
