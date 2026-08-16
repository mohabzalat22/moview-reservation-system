export interface Reservation {
  id: string;
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
