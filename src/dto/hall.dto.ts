export interface Hall {
  id: string;
  name: string;
  description: string | null;
  capacity: number;
  createdAt: Date;
  updatedAt: Date;
}
export interface CreateHall {
  name: string;
  description?: string | null;
  capacity: number;
  createdAt: Date;
  updatedAt: Date;
}
export interface UpdateHall {
  name: string;
  description?: string | null;
  capacity?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
