import prisma from "../config/prisma.ts";
import type {
  CreateReservationSeat,
  ReservationSeat,
  UpdateReservationSeat,
} from "../dto/reservationSeat.dto.ts";

export class ReservationSeatRepository {
  async findAll(): Promise<ReservationSeat[] | null> {
    return prisma.reservationSeat.findMany();
  }

  async findAllBySeatId(seatId: string): Promise<ReservationSeat[] | null> {
    return prisma.reservationSeat.findMany({ where: { seatId } });
  }

  async findAllByReservationId(
    reservationId: string,
  ): Promise<ReservationSeat[] | null> {
    return prisma.reservationSeat.findMany({ where: { reservationId } });
  }

  async findById(id: string): Promise<ReservationSeat | null> {
    return prisma.reservationSeat.findUnique({ where: { id } });
  }

  async create(data: CreateReservationSeat): Promise<ReservationSeat> {
    return prisma.reservationSeat.create({ data });
  }

  async update(
    id: string,
    data: UpdateReservationSeat,
  ): Promise<ReservationSeat> {
    return prisma.reservationSeat.update({ where: { id }, data });
  }

  async deleteById(id: string): Promise<ReservationSeat> {
    return prisma.reservationSeat.delete({ where: { id } });
  }
}
