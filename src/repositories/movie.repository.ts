import type { CreateMovie, Movie, UpdateMovie } from "../dto/movie.dto.ts";
import prisma from "../config/prisma";

export class MovieRepository {
  async findAll(): Promise<Movie[] | null> {
    return prisma.movie.findMany();
  }

  async findById(id: string): Promise<Movie | null> {
    return prisma.movie.findUnique({ where: { id } });
  }

  async findByName(name: string): Promise<Movie | null> {
    return prisma.movie.findUnique({ where: { name } });
  }

  async create(data: CreateMovie): Promise<Movie> {
    return prisma.movie.create({ data });
  }

  async update(id: string, data: UpdateMovie): Promise<Movie> {
    return prisma.movie.update({ where: { id }, data });
  }

  async deleteById(id: string): Promise<Movie> {
    return prisma.movie.delete({ where: { id } });
  }
}
