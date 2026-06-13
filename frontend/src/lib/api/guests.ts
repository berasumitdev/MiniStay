import api from "@/lib/axios";
import type { ApiResponse, Guest, GuestRequest, GuestStatus } from "@/types";

const BASE = "/api/guest/guests";

export const guestsApi = {
  getAll: async (): Promise<Guest[]> => {
    const res = await api.get<ApiResponse<Guest[]>>(BASE);
    return res.data.data;
  },

  getById: async (id: number): Promise<Guest> => {
    const res = await api.get<ApiResponse<Guest>>(`${BASE}/${id}`);
    return res.data.data;
  },

  search: async (name: string): Promise<Guest[]> => {
    const res = await api.get<ApiResponse<Guest[]>>(`${BASE}/search`, {
      params: { name },
    });
    return res.data.data;
  },

  create: async (payload: GuestRequest): Promise<Guest> => {
    const res = await api.post<ApiResponse<Guest>>(BASE, payload);
    return res.data.data;
  },

  update: async (id: number, payload: GuestRequest): Promise<Guest> => {
    const res = await api.put<ApiResponse<Guest>>(`${BASE}/${id}`, payload);
    return res.data.data;
  },

  updateStatus: async (id: number, status: GuestStatus): Promise<Guest> => {
    const res = await api.patch<ApiResponse<Guest>>(
      `${BASE}/${id}/status`,
      null,
      {
        params: { status },
      },
    );
    return res.data.data;
  },

  remove: async (id: number): Promise<void> => {
    await api.delete<ApiResponse<void>>(`${BASE}/${id}`);
  },
};
