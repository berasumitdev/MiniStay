import api from "@/lib/axios";
import type { ApiResponse, Room, RoomRequest, RoomStatus } from "@/types";

const BASE = "/api/property/rooms";

export const roomsApi = {
  getAll: async (): Promise<Room[]> => {
    const res = await api.get<ApiResponse<Room[]>>(BASE);
    return res.data.data;
  },

  getAvailable: async (): Promise<Room[]> => {
    const res = await api.get<ApiResponse<Room[]>>(`${BASE}/available`);
    return res.data.data;
  },

  getById: async (id: number): Promise<Room> => {
    const res = await api.get<ApiResponse<Room>>(`${BASE}/${id}`);
    return res.data.data;
  },

  create: async (payload: RoomRequest): Promise<Room> => {
    const res = await api.post<ApiResponse<Room>>(BASE, payload);
    return res.data.data;
  },

  update: async (id: number, payload: RoomRequest): Promise<Room> => {
    const res = await api.put<ApiResponse<Room>>(`${BASE}/${id}`, payload);
    return res.data.data;
  },

  updateStatus: async (id: number, status: RoomStatus): Promise<Room> => {
    const res = await api.patch<ApiResponse<Room>>(
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
