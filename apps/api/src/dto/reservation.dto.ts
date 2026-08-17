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
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateReservation {
  userId: string;
  showTimeId: string;
  createdAt?: Date;
  updatedAt?: Date;
  seats?: { seatId: string; price: number }[];
}

export interface UpdateReservation {
  userId?: string;
  showTimeId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UpdateReservationStatus {
  status: ReservationStatus;
}
