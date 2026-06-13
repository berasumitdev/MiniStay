"use client";

import { useState } from "react";
import {
  useGuests,
  useCreateGuest,
  useDeleteGuest,
  useUpdateGuestStatus,
} from "@/hooks/useGuests";
import { useAuth } from "@/hooks/useAuth";
import { Button, Badge, Spinner, ErrorBox } from "@/components/ui";
import { getApiErrorMessage } from "@/lib/axios";
import type { GuestRequest, GuestStatus, IdProofType } from "@/types";

const ID_PROOF_TYPES: IdProofType[] = [
  "PASSPORT",
  "AADHAR",
  "PAN",
  "DRIVING_LICENSE",
  "VOTER_ID",
];
const STATUS_COLOR: Record<GuestStatus, string> = {
  ACTIVE: "green",
  INACTIVE: "gray",
  BLACKLISTED: "red",
};

const EMPTY: GuestRequest = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  idProofType: "AADHAR",
  idProofNumber: "",
  nationality: "",
  address: "",
};

export default function GuestsPage() {
  const { isAdmin } = useAuth();
  const { data: guests, isLoading, isError, error } = useGuests();
  const createGuest = useCreateGuest();
  const deleteGuest = useDeleteGuest();
  const updateStatus = useUpdateGuestStatus();

  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState("");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<GuestRequest>(EMPTY);

  const handleCreate = async () => {
    setFormError("");
    try {
      await createGuest.mutateAsync(form);
      setShowForm(false);
      setForm(EMPTY);
    } catch (e) {
      setFormError(getApiErrorMessage(e));
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this guest?")) return;
    await deleteGuest.mutateAsync(id);
  };

  const filtered = guests?.filter((g) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      g.firstName.toLowerCase().includes(q) ||
      g.lastName.toLowerCase().includes(q) ||
      g.email.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Guests</h1>
        {isAdmin && (
          <Button onClick={() => setShowForm((s) => !s)}>
            {showForm ? "Cancel" : "+ Register guest"}
          </Button>
        )}
      </div>

      <input
        className="input max-w-xs"
        placeholder="Search by name or email…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {showForm && isAdmin && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
          {formError && <ErrorBox message={formError} />}
          <div className="grid grid-cols-2 gap-3">
            <Field label="First name">
              <input
                className="input"
                value={form.firstName}
                onChange={(e) =>
                  setForm({ ...form, firstName: e.target.value })
                }
              />
            </Field>
            <Field label="Last name">
              <input
                className="input"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              />
            </Field>
            <Field label="Email">
              <input
                className="input"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </Field>
            <Field label="Phone">
              <input
                className="input"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </Field>
            <Field label="ID proof type">
              <select
                className="input"
                value={form.idProofType}
                onChange={(e) =>
                  setForm({
                    ...form,
                    idProofType: e.target.value as IdProofType,
                  })
                }
              >
                {ID_PROOF_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="ID proof number">
              <input
                className="input"
                value={form.idProofNumber}
                onChange={(e) =>
                  setForm({ ...form, idProofNumber: e.target.value })
                }
              />
            </Field>
            <Field label="Nationality">
              <input
                className="input"
                value={form.nationality}
                onChange={(e) =>
                  setForm({ ...form, nationality: e.target.value })
                }
              />
            </Field>
            <Field label="Address">
              <input
                className="input"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </Field>
          </div>
          <Button onClick={handleCreate} disabled={createGuest.isPending}>
            {createGuest.isPending ? "Saving…" : "Register guest"}
          </Button>
        </div>
      )}

      {isLoading && <Spinner />}
      {isError && <ErrorBox message={getApiErrorMessage(error)} />}

      {filtered && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-500">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Phone</th>
                <th className="px-4 py-2">Nationality</th>
                <th className="px-4 py-2">Status</th>
                {isAdmin && <th className="px-4 py-2">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map((g) => (
                <tr key={g.id} className="border-t border-gray-100">
                  <td className="px-4 py-2 font-medium">
                    {g.firstName} {g.lastName}
                  </td>
                  <td className="px-4 py-2">{g.email}</td>
                  <td className="px-4 py-2">{g.phone}</td>
                  <td className="px-4 py-2">{g.nationality ?? "—"}</td>
                  <td className="px-4 py-2">
                    {isAdmin ? (
                      <select
                        className="text-xs border border-gray-200 rounded px-1 py-0.5"
                        value={g.status}
                        onChange={(e) =>
                          updateStatus.mutate({
                            id: g.id,
                            status: e.target.value as GuestStatus,
                          })
                        }
                      >
                        {(Object.keys(STATUS_COLOR) as GuestStatus[]).map(
                          (s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ),
                        )}
                      </select>
                    ) : (
                      <Badge color={STATUS_COLOR[g.status]}>{g.status}</Badge>
                    )}
                  </td>
                  {isAdmin && (
                    <td className="px-4 py-2">
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(g.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  )}
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-gray-400"
                  >
                    No guests found.
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
