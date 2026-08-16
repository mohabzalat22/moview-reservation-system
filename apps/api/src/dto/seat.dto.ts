export interface Seat {
  id: string;
  sectionId: string;
  number: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSeat {
  sectionId: string;
  number: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateSeat {
  sectionId?: string;
  number?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
