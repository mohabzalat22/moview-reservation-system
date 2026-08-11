export interface Hall {
  id: string;
  description?: string;
  capacity: number;
  createdAt: Date;
  updatedAt: Date;
}
export interface CreateHall {
  description?: string;
  capacity: number;
  createdAt: Date;
  updatedAt: Date;
}
export interface UpdateHall {
  description?: string;
  capacity?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
