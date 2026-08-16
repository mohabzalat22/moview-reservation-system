import { Decimal } from "@prisma/client/runtime/client";

export interface Section {
  id: string;
  hallId: string;
  name: string;
  additionPrice: Decimal;
  rows: number;
  columns: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSection {
  hallId: string;
  name: string;
  additionPrice: Decimal;
  rows: number;
  columns: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateSection {
  hallId?: string;
  name?: string;
  additionPrice?: Decimal;
  rows?: number;
  columns?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
