import { Decimal } from "@prisma/client/runtime/client";
export interface ShowTime {
  id: string;
  basePrice: Decimal;
  baseCurrency?: string;
  showTimeStart: Date;
  showTimeEnd: Date;
  createdAt: Date;
  updatedAt: Date;
  movieId: string;
  hallId: string;
}

export interface CreateShowTime {
  basePrice: Decimal;
  baseCurrency?: string;
  showTimeStart: Date;
  showTimeEnd: Date;
  createdAt: Date;
  updatedAt: Date;
  movieId: string;
  hallId: string;
}

export interface UpdateShowTime {
  id?: string;
  basePrice?: Decimal;
  baseCurrency?: string;
  showTimeStart?: Date;
  showTimeEnd?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  movieId?: string;
  hallId?: string;
}
