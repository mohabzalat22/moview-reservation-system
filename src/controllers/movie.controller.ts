import { CreateMovie, UpdateMovie } from "../dto/movie.dto";
import { MovieService } from "../services/movie.service";
import { ApiResponse } from "../utils/api-response";
import type { Request, Response } from "express";

export class MovieController {
  private MovieService;
  private apiResponse;

  constructor() {
    this.apiResponse = new ApiResponse();
    this.MovieService = new MovieService();
  }

  async index(req: Request, res: Response) {
    const Movies = await this.MovieService.getMovies();
    return this.apiResponse.success(res, Movies);
  }

  async show(req: Request, res: Response) {
    const id = req.params.id as string;
    const Movie = await this.MovieService.getMovieById(id);
    return this.apiResponse.success(res, Movie);
  }

  async store(req: Request, res: Response) {
    const data = req.body as CreateMovie;
    const Movie = await this.MovieService.createMovie(data);
    return this.apiResponse.success(res, Movie);
  }

  async update(req: Request, res: Response) {
    const id = req.params.id as string;
    const data = req.body as UpdateMovie;
    const Movie = await this.MovieService.updateMovie(id, data);
    return this.apiResponse.success(res, Movie);
  }

  async delete(req: Request, res: Response) {
    const id = req.params.id as string;
    const Movie = await this.MovieService.deleteMovieById(id);
    return this.apiResponse.success(res, Movie);
  }
}
