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

  async findStats(id: string): Promise<any> {
    const showTime = await prisma.showTime.findUnique({
      where: { id },
      include: {
        movie: true,
        hall: {
          include: {
            sections: {
              include: {
                seats: true,
              },
            },
          },
        },
        reservations: {
          include: {
            seats: {
              include: {
                seat: {
                  include: {
                    section: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!showTime) return null;

    const basePrice = Number(showTime.basePrice);

    // Capacity: sum of seats across all sections in the hall
    const totalSeats = showTime.hall.sections.reduce(
      (acc: number, section: any) => acc + section.seats.length,
      0
    );

    // Gather per-section seat counts for breakdown
    const sectionBreakdown = showTime.hall.sections.map((section: any) => ({
      sectionId: section.id,
      sectionName: section.name,
      additionPrice: Number(section.additionPrice),
      totalSeats: section.seats.length,
      reservedSeats: 0,
      revenue: 0,
    }));

    const sectionMap = new Map(
      sectionBreakdown.map((s: any) => [s.sectionId, s])
    );

    let totalRevenue = 0;
    let totalReserved = 0;

    for (const reservation of showTime.reservations) {
      for (const rs of reservation.seats) {
        const seatPrice = Number(rs.price);
        totalRevenue += seatPrice;
        totalReserved += 1;

        const sectionEntry = sectionMap.get(rs.seat.sectionId);
        if (sectionEntry) {
          sectionEntry.reservedSeats += 1;
          sectionEntry.revenue += seatPrice;
        }
      }
    }

    return {
      showTimeId: id,
      movieTitle: showTime.movie.title,
      hallName: showTime.hall.name,
      showTimeStart: showTime.showTimeStart,
      showTimeEnd: showTime.showTimeEnd,
      basePrice,
      baseCurrency: showTime.baseCurrency,
      totalSeats,
      reservedSeats: totalReserved,
      availableSeats: totalSeats - totalReserved,
      occupancyRate: totalSeats > 0 ? (totalReserved / totalSeats) * 100 : 0,
      totalRevenue,
      sectionBreakdown: Array.from(sectionMap.values()),
    };
  }
}
