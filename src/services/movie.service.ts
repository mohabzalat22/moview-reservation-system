import type { createMovie, updateMovie } from "../dto/movie.dto";
import { MovieRepository } from "../repositories/movie.repository";
export class MovieService {
  private movieRepository;

  constructor() {
    this.movieRepository = new MovieRepository();
  }

  async getMovies() {
    return this.movieRepository.findAll();
  }

  async getMovieById(id: string) {
    return this.movieRepository.findById(id);
  }

  async createMovie(data: createMovie) {
    const movieExists = await this.movieRepository.findByName(data.name);
    if (movieExists) {
      throw new Error("movie already exists");
    }
    return this.movieRepository.create(data);
  }

  async updateMovie(id: string, data: updateMovie) {
    const movieExists = await this.movieRepository.findById(id);
    if (!movieExists) {
      throw new Error("movie doesnot exists");
    }
    return this.movieRepository.update(id, data);
  }

  async deleteMovieById(id: string) {
    const movieExists = await this.movieRepository.findById(id);
    if (!movieExists) {
      throw new Error("movie doesnot exists");
    }
    return this.movieRepository.deleteById(id);
  }
}
