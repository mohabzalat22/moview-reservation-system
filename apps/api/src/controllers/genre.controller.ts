import { CreateGenre, UpdateGenre } from "../dto/genre.dto";
import { GenreService } from "../services/genre.service";
import { ApiResponse } from "../utils/api-response";
import type { Request, Response } from "express";
export class GenreController {
  private genreService;
  private apiResponse;

  constructor() {
    this.apiResponse = new ApiResponse();
    this.genreService = new GenreService();
  }

  async index(req: Request, res: Response) {
    const genres = await this.genreService.getGenres();
    return this.apiResponse.success(res, genres);
  }

  async show(req: Request, res: Response) {
    const id = req.params.id as string;
    const genre = await this.genreService.getGenreById(id);
    return this.apiResponse.success(res, genre);
  }

  async store(req: Request, res: Response) {
    const data = req.body as CreateGenre;
    const genre = await this.genreService.createGenre(data);
    return this.apiResponse.success(res, genre);
  }

  async update(req: Request, res: Response) {
    const id = req.params.id as string;
    const data = req.body as UpdateGenre;
    const genre = await this.genreService.updateGenre(id, data);
    return this.apiResponse.success(res, genre);
  }

  async delete(req: Request, res: Response) {
    const id = req.params.id as string;
    const genre = await this.genreService.deleteGenreById(id);
    return this.apiResponse.success(res, genre);
  }
}
