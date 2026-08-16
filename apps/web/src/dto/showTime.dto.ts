export interface ShowTime {
  id: string;
  basePrice: number;
  baseCurrency?: string;
  showTimeStart: string;
  showTimeEnd: string;
  createdAt?: string;
  updatedAt?: string;
  movieId: string;
  hallId: string;
}

export interface CreateShowTime {
  basePrice: number;
  baseCurrency?: string;
  showTimeStart: string;
  showTimeEnd: string;
  createdAt?: string;
  updatedAt?: string;
  movieId: string;
  hallId: string;
}

export interface UpdateShowTime {
  id?: string;
  basePrice?: number;
  baseCurrency?: string;
  showTimeStart?: string;
  showTimeEnd?: string;
  createdAt?: string;
  updatedAt?: string;
  movieId?: string;
  hallId?: string;
}
