import prisma from "../config/prisma";
import type {
  CreateReservation,
  Reservation,
  UpdateReservation,
} from "../dto/reservation.dto.ts";

export class ReservationRepository {
  async findAll(): Promise<Reservation[] | null> {
    return prisma.reservation.findMany();
  }

  async findAllByUserId(userId: string): Promise<Reservation[] | null> {
    return prisma.reservation.findMany({ where: { userId } });
  }

  async findAllByShowTimeId(showTimeId: string): Promise<Reservation[] | null> {
    return prisma.reservation.findMany({ where: { showTimeId } });
  }

  async findById(id: string): Promise<Reservation | null> {
    return prisma.reservation.findUnique({ where: { id } });
  }

  async create(data: CreateReservation): Promise<Reservation> {
    return prisma.reservation.create({ data });
  }

  async update(id: string, data: UpdateReservation): Promise<Reservation> {
    return prisma.reservation.update({ where: { id }, data });
  }

  async deleteById(id: string): Promise<Reservation> {
    return prisma.reservation.delete({ where: { id } });
  }
}
