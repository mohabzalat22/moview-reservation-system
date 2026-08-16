import prisma from "../config/prisma";
import type { CreateGenre, Genre, UpdateGenre } from "../dto/genre.dto";

export class GenreRepository {
  async findAll(): Promise<Genre[] | null> {
    return prisma.genre.findMany();
  }

  async findById(id: string): Promise<Genre | null> {
    return prisma.genre.findUnique({ where: { id } });
  }

  async findByName(name: string): Promise<Genre | null> {
    return prisma.genre.findUnique({ where: { name } });
  }

  async create(data: CreateGenre): Promise<Genre> {
    return prisma.genre.create({ data });
  }

  async update(id: string, data: UpdateGenre): Promise<Genre> {
    return prisma.genre.update({ where: { id }, data });
  }

  async deleteById(id: string): Promise<Genre> {
    return prisma.genre.delete({ where: { id } });
  }
}
