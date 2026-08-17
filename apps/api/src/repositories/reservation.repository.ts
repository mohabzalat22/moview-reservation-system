import prisma from "../config/prisma";
import type {
  CreateReservation,
  UpdateReservation,
  UpdateReservationStatus,
} from "../dto/reservation.dto.ts";

export class ReservationRepository {
  async findAll(): Promise<any[]> {
    return prisma.reservation.findMany({ include: { seats: true } });
  }

  async findAllByUserId(userId: string): Promise<any[]> {
    return prisma.reservation.findMany({
      where: { userId },
      include: { seats: true },
    });
  }

  async findAllByShowTimeId(showTimeId: string): Promise<any[]> {
    return prisma.reservation.findMany({ where: { showTimeId } });
  }

  async findById(id: string): Promise<any | null> {
    return prisma.reservation.findUnique({ where: { id }, include: { seats: true } } as any);
  }

  async create(data: any): Promise<any> {
    const { seats, ...rest } = data;
    return prisma.reservation.create({
      data: {
        ...rest,
        ...(seats && { seats: { create: seats } })
      }
    });
  }

  async update(id: string, data: UpdateReservation): Promise<any> {
    return prisma.reservation.update({ where: { id }, data });
  }

  async updateStatus(id: string, data: UpdateReservationStatus): Promise<any> {
    return prisma.reservation.update({ where: { id }, data: { status: data.status } });
  }

  async deleteById(id: string): Promise<any> {
    return prisma.reservation.delete({ where: { id } });
  }
}
