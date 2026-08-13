import prisma from "../config/prisma";
import { type CreateUser, type UpdateUser, type User } from "../dto/user.dto";

export class UserRepository {
  async findAll(): Promise<User[]> {
    return prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async create(data: CreateUser): Promise<User> {
    return prisma.user.create({ data });
  }

  async update(email: string, data: UpdateUser): Promise<User> {
    return prisma.user.update({ where: { email }, data });
  }

  async deleteById(id: string): Promise<User> {
    return prisma.user.delete({ where: { id } });
  }

  async deleteByEmail(email: string): Promise<User> {
    return prisma.user.delete({ where: { email } });
  }
}
