import type { Role } from "../generated/prisma/enums.ts";

export interface DBUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
}
export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}
export interface CreateUser {
  name: string;
  email: string;
  role: Role;
  password: string;
}

export interface UpdateUser {
  name: string;
  email?: string;
  role?: Role;
  password?: string;
}
