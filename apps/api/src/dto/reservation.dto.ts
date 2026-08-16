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
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateReservation {
  userId?: string;
  showTimeId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
