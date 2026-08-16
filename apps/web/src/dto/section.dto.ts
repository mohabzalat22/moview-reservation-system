
export interface Section {
  id: string;
  hallId: string;
  name: string;
  additionPrice: number;
  rows: number;
  columns: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSection {
  hallId: string;
  name: string;
  additionPrice: number;
  rows: number;
  columns: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateSection {
  hallId?: string;
  name?: string;
  additionPrice?: number;
  rows?: number;
  columns?: number;
  createdAt?: string;
  updatedAt?: string;
}
