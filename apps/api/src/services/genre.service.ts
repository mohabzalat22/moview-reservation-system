import type { CreateGenre, UpdateGenre } from "../dto/genre.dto";
import { GenreRepository } from "../repositories/genre.repository";
export class GenreService {
  private GenreRepository;

  constructor() {
    this.GenreRepository = new GenreRepository();
  }

  async getGenres() {
    return this.GenreRepository.findAll();
  }

  async getGenreById(id: string) {
    return this.GenreRepository.findById(id);
  }

  async createGenre(data: CreateGenre) {
    const GenreExists = await this.GenreRepository.findByName(data.name);
    if (GenreExists) {
      throw new Error("Genre already exists");
    }
    return this.GenreRepository.create(data);
  }

  async updateGenre(id: string, data: UpdateGenre) {
    const GenreExists = await this.GenreRepository.findById(id);
    if (!GenreExists) {
      throw new Error("Genre doesnot exists");
    }
    return this.GenreRepository.update(id, data);
  }

  async deleteGenreById(id: string) {
    const GenreExists = await this.GenreRepository.findById(id);
    if (!GenreExists) {
      throw new Error("Genre doesnot exists");
    }
    return this.GenreRepository.deleteById(id);
  }
}
