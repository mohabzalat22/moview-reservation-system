export interface ShowTime {
  id: String;
  basePrice: number;
  baseCurrency?: String;
  showTimeStart: Date;
  showTimeEnd: Date;
  createdAt: Date;
  updatedAt: Date;
  movieId: String;
  hallId: String;
}

export interface CreateShowTime {
  basePrice: number;
  baseCurrency?: String;
  showTimeStart: Date;
  showTimeEnd: Date;
  createdAt: Date;
  updatedAt: Date;
  movieId: String;
  hallId: String;
}

export interface UpdateShowTime {
  id?: String;
  basePrice?: number;
  baseCurrency?: String;
  showTimeStart?: Date;
  showTimeEnd?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  movieId?: String;
  hallId?: String;
}
