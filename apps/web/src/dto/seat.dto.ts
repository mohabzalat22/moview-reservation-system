export interface Seat {
  id: string;
  sectionId: string;
  number: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSeat {
  sectionId: string;
  number: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateSeat {
  sectionId?: string;
  number?: number;
  createdAt?: string;
  updatedAt?: string;
}
