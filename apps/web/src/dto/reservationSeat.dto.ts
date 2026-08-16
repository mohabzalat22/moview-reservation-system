
export interface ReservationSeat {
  id: string;
  reservationId: string;
  seatId: string;
  price: number;
}

export interface CreateReservationSeat {
  reservationId: string;
  seatId: string;
  price: number;
}

export interface UpdateReservationSeat {
  reservationId?: string;
  seatId?: string;
  price?: number;
}
