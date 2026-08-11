import prisma from "../config/prisma.ts";
import type {
  CreateSection,
  Section,
  UpdateSection,
} from "../dto/section.dto.ts";

export class SectionRepository {
  async findAll(): Promise<Section[] | null> {
    return prisma.section.findMany();
  }

  async findAllByHallId(hallId: string): Promise<Section[] | null> {
    return prisma.section.findMany({
      where: {
        hallId,
      },
    });
  }

  async findByHallId(hallId: string): Promise<Section[] | null> {
    return prisma.section.findUnique({
      where: {
        hallId,
      },
    });
  }

  async findById(id: string): Promise<Section | null> {
    return prisma.section.findUnique({ where: { id } });
  }

  async create(data: CreateSection): Promise<Section> {
    return prisma.section.create({ data });
  }

  async update(id: string, data: UpdateSection): Promise<Section> {
    return prisma.section.update({ where: { id }, data });
  }

  async deleteById(id: string): Promise<Section> {
    return prisma.section.delete({ where: { id } });
  }
}
