export interface Hall {
  id: string;
  name: string;
  description: string | null;
  capacity: number;
  createdAt?: string;
  updatedAt?: string;
}
export interface CreateHall {
  name: string;
  description?: string | null;
  capacity: number;
  createdAt?: string;
  updatedAt?: string;
}
export interface UpdateHall {
  name: string;
  description?: string | null;
  capacity?: number;
  createdAt?: string;
  updatedAt?: string;
}
