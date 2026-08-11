import prisma from "../config/prisma.ts";
import type {
  CreateShowTime,
  ShowTime,
  UpdateShowTime,
} from "../dto/showTime.dto.ts";

export class ShowTimeRepository {
  async findAll(): Promise<ShowTime[] | null> {
    return prisma.showTime.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findById(id: string): Promise<ShowTime | null> {
    return prisma.showTime.findUnique({
      where: {
        id,
      },
    });
  }

  async create(data: CreateShowTime): Promise<ShowTime> {
    return prisma.showTime.create(data);
  }

  async update(id: string, data: UpdateShowTime): Promise<ShowTime> {
    return prisma.showTime.update({ where: { id }, data });
  }

  async deleteById(id: string): Promise<ShowTime> {
    return prisma.showTime.delete({ where: { id } });
  }
}
