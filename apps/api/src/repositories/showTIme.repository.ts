import prisma from "../config/prisma";
import type {
  CreateShowTime,
  ShowTime,
  UpdateShowTime,
} from "../dto/showTime.dto.ts";

export class ShowTimeRepository {
  async findAll(date?: string, upcomingOnly: boolean = false): Promise<any[] | null> {
    const whereClause: any = {};
    const now = new Date();
    if (date) {
      const startOfDay = new Date(`${date}T00:00:00.000Z`);
      const endOfDay   = new Date(`${date}T23:59:59.999Z`);
      whereClause.showTimeStart = {
        gte: (upcomingOnly && startOfDay < now) ? now : startOfDay,
        lte: endOfDay,
      };
    } else if (upcomingOnly) {
      whereClause.showTimeStart = {
        gte: now,
      };
    }
    return prisma.showTime.findMany({
      where: whereClause,
      include: {
        movie: true,
        hall: true,
      },
      orderBy: {
        showTimeStart: "asc",
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
    return prisma.showTime.create({ data });
  }

  async update(id: string, data: UpdateShowTime): Promise<ShowTime> {
    return prisma.showTime.update({ where: { id }, data });
  }

  async deleteById(id: string): Promise<ShowTime> {
    return prisma.showTime.delete({ where: { id } });
  }
}
