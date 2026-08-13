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

  async show() {}

  async store() {}

  async update() {}

  async delete() {}
}
