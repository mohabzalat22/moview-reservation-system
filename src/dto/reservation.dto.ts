export interface Reservation {
  id: string;
  userId: string;
  showTimeId: String;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateReservation {
  userId: string;
  showTimeId: String;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateReservation {
  userId?: string;
  showTimeId?: String;
  createdAt?: Date;
  updatedAt?: Date;
}
