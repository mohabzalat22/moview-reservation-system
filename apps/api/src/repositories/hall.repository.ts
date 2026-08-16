import prisma from "../config/prisma";
import type { CreateHall, Hall, UpdateHall } from "../dto/hall.dto";

export class HallRepository {
  async findAll(): Promise<Hall[] | null> {
    return prisma.hall.findMany();
  }

  async findById(id: string): Promise<Hall | null> {
    return prisma.hall.findUnique({ where: { id } });
  }

  async create(data: CreateHall): Promise<Hall> {
    return prisma.hall.create({ data });
  }

  async update(id: string, data: UpdateHall): Promise<Hall> {
    return prisma.hall.update({ where: { id }, data });
  }

  async deleteById(id: string): Promise<Hall> {
    return prisma.hall.delete({ where: { id } });
  }
}
