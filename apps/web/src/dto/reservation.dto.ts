export interface Reservation {
  id: string;
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
