import api from "@/lib/axios";
import type {
  ApiResponse,
  AvailabilityResult,
  Booking,
  BookingRequest,
  BookingStatus,
} from "@/types";

const BASE = "/api/booking/bookings";

export const bookingsApi = {
  getAll: async (): Promise<Booking[]> => {
    const res = await api.get<ApiResponse<Booking[]>>(BASE);
    return res.data.data;
  },

  getById: async (id: number): Promise<Booking> => {
    const res = await api.get<ApiResponse<Booking>>(`${BASE}/${id}`);
    return res.data.data;
  },

  checkAvailability: async (
    roomId: number,
    checkIn: string,
    checkOut: string,
  ): Promise<AvailabilityResult> => {
    const res = await api.get<ApiResponse<AvailabilityResult>>(
      `${BASE}/availability`,
      {
        params: { roomId, checkIn, checkOut },
      },
    );
    return res.data.data;
  },

  create: async (payload: BookingRequest): Promise<Booking> => {
    const res = await api.post<ApiResponse<Booking>>(BASE, payload);
    return res.data.data;
  },

  checkIn: async (id: number): Promise<Booking> => {
    const res = await api.patch<ApiResponse<Booking>>(`${BASE}/${id}/checkin`);
    return res.data.data;
  },

  checkOut: async (id: number): Promise<Booking> => {
    const res = await api.patch<ApiResponse<Booking>>(`${BASE}/${id}/checkout`);
    return res.data.data;
  },

  cancel: async (id: number): Promise<Booking> => {
    const res = await api.patch<ApiResponse<Booking>>(`${BASE}/${id}/cancel`);
    return res.data.data;
  },

  remove: async (id: number): Promise<void> => {
    await api.delete<ApiResponse<void>>(`${BASE}/${id}`);
  },
};
