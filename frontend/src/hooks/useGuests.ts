"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { guestsApi } from "@/lib/api/guests";
import type { GuestRequest, GuestStatus } from "@/types";

const guestKeys = {
  all: ["guests"] as const,
  list: () => [...guestKeys.all, "list"] as const,
  search: (name: string) => [...guestKeys.all, "search", name] as const,
};

export function useGuests() {
  return useQuery({
    queryKey: guestKeys.list(),
    queryFn: guestsApi.getAll,
  });
}

export function useSearchGuests(name: string) {
  return useQuery({
    queryKey: guestKeys.search(name),
    queryFn: () => guestsApi.search(name),
    enabled: name.trim().length > 0,
  });
}

export function useCreateGuest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: GuestRequest) => guestsApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: guestKeys.all }),
  });
}

export function useUpdateGuest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: GuestRequest }) =>
      guestsApi.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: guestKeys.all }),
  });
}

export function useUpdateGuestStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: GuestStatus }) =>
      guestsApi.updateStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: guestKeys.all }),
  });
}

export function useDeleteGuest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => guestsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: guestKeys.all }),
  });
}
