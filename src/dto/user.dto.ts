import type { Role } from "../generated/prisma/enums.ts";

export interface User {
  id: string;
  email: string;
  role: Role;
}

export interface CreateUser {
  email: string;
  role: Role;
  password: string;
}

export interface UpdateUser {
  email?: string;
  role?: Role;
  password?: string;
}
