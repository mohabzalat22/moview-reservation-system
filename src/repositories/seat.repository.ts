import prisma from "../config/prisma.ts";
import type { CreateSeat, Seat, UpdateSeat } from "../dto/seat.dto.ts";

export class SeatRepository {
  async findAll(): Promise<Seat[] | null> {
    return prisma.seat.findMany();
  }
  async findAllBySectionId(sectionId: string): Promise<Seat[] | null> {
    return prisma.seat.findMany({ where: { sectionId } });
  }

  async findBySectionId(sectionId: string): Promise<Seat[] | null> {
    return prisma.seat.findUnique({ where: { sectionId } });
  }

  async findById(id: string): Promise<Seat | null> {
    return prisma.seat.findUnique({ where: { id } });
  }

  async create(data: CreateSeat): Promise<Seat> {
    return prisma.seat.create({ data });
  }

  async update(id: string, data: UpdateSeat): Promise<Seat> {
    return prisma.seat.update({ where: { id }, data });
  }

  async deleteById(id: string): Promise<Seat> {
    return prisma.seat.delete({ where: { id } });
  }
}
