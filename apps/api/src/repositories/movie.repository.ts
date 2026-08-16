import type { CreateMovie, Movie, UpdateMovie } from "../dto/movie.dto.ts";
import prisma from "../config/prisma";

export class MovieRepository {
  async findAll(): Promise<any> {
    return prisma.movie.findMany({ include: { genres: true } });
  }

  async findById(id: string): Promise<any> {
    return prisma.movie.findUnique({ where: { id }, include: { genres: true } });
  }

  async findByName(name: string): Promise<any> {
    return prisma.movie.findUnique({ where: { name }, include: { genres: true } });
  }

  async create(data: any): Promise<Movie> {
    const { genreIds, ...rest } = data;
    return prisma.movie.create({ 
      data: {
        ...rest,
        ...(genreIds && genreIds.length > 0 && {
          genres: { connect: genreIds.map((id: string) => ({ id })) }
        })
      } 
    });
  }

  async update(id: string, data: any): Promise<Movie> {
    const { genreIds, ...rest } = data;
    return prisma.movie.update({ 
      where: { id }, 
      data: {
        ...rest,
        ...(genreIds !== undefined && {
          genres: { set: genreIds.map((gid: string) => ({ id: gid })) }
        })
      } 
    });
  }

  async deleteById(id: string): Promise<Movie> {
    return prisma.movie.delete({ where: { id } });
  }
}
