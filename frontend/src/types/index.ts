// PROPERTY
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

// GUEST

export type IdProofType =
  | "PASSPORT"
  | "AADHAR"
  | "PAN"
  | "DRIVING_LICENSE"
  | "VOTER_ID";
export type GuestStatus = "ACTIVE" | "INACTIVE" | "BLACKLISTED";

export interface Guest {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  idProofType?: IdProofType;
  idProofNumber?: string;
  dateOfBirth?: string;
  nationality?: string;
  address?: string;
  status: GuestStatus;
  createdAt: string;
  updatedAt: string;
}

export interface GuestRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  idProofType?: IdProofType;
  idProofNumber?: string;
  dateOfBirth?: string;
  nationality?: string;
  address?: string;
}

// BOOKING

export type BookingStatus =
  | "CONFIRMED"
  | "CHECKED_IN"
  | "CHECKED_OUT"
  | "CANCELLED"
  | "NO_SHOW";

export interface Booking {
  id: number;
  guestId: number;
  roomId: number;
  checkIn: string;
  checkOut: string;
  status: BookingStatus;
  totalAmount?: number;
  numberOfGuests: number;
  specialRequests?: string;
  bookingReference?: string;
  numberOfNights: number;
  createdAt: string;
  updatedAt: string;
}

export interface BookingRequest {
  guestId: number;
  roomId: number;
  checkIn: string;
  checkOut: string;
  numberOfGuests?: number;
  specialRequests?: string;
  pricePerNight?: number;
}

export interface AvailabilityResult {
  roomId: number;
  checkIn: string;
  checkOut: string;
  available: boolean;
}