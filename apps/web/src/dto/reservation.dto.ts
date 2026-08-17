export enum ReservationStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
}

export interface Reservation {
  id: string;
  status: ReservationStatus;
  userId: string;
  showTimeId: string;
  createdAt?: string;
  updatedAt?: string;
  seats?: { seatId: string; price: number }[];
}

export interface CreateReservation {
  userId: string;
  showTimeId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateReservation {
  userId?: string;
  showTimeId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateReservationStatus {
  status: ReservationStatus;
}
