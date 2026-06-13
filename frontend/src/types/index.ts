export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  error?: string;
  timestamp: string;
}

export type Role = "ADMIN" | "STAFF";

export interface AuthUser {
  name: string;
  role: Role;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
}

export type RoomType =
  | "SINGLE"
  | "DOUBLE"
  | "TWIN"
  | "SUITE"
  | "DELUXE"
  | "PRESIDENTIAL";
export type RoomStatus = "AVAILABLE" | "OCCUPIED" | "MAINTENANCE" | "RESERVED";

export interface Room {
  id: number;
  roomNumber: string;
  roomType: RoomType;
  floor: number;
  pricePerNight: number;
  status: RoomStatus;
  description?: string;
  capacity: number;
  createdAt: string;
  updatedAt: string;
}

export interface RoomRequest {
  roomNumber: string;
  roomType: RoomType;
  floor: number;
  pricePerNight: number;
  status?: RoomStatus;
  description?: string;
  capacity?: number;
}
