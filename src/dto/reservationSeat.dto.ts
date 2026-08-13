import { Decimal } from "@prisma/client/runtime/client";

export interface ReservationSeat {
  id: string;
  reservationId: string;
  seatId: string;
  price: Decimal;
}

export interface CreateReservationSeat {
  reservationId: string;
  seatId: string;
  price: Decimal;
}

export interface UpdateReservationSeat {
  reservationId?: string;
  seatId?: string;
  price?: Decimal;
}
