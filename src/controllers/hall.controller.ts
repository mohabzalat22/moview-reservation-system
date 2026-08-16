import type { CreateHall, UpdateHall } from "../dto/hall.dto";
import { HallService } from "../services/hall.service";
import { ApiResponse } from "../utils/api-response";
import type { Request, Response } from "express";

export class HallController {
  private hallService;
  private apiResponse;

  constructor() {
    this.apiResponse = new ApiResponse();
    this.hallService = new HallService();
  }

  async index(req: Request, res: Response) {
    const halls = await this.hallService.getHalls();
    return this.apiResponse.success(res, halls);
  }

  async show(req: Request, res: Response) {
    const id = req.params.id as string;
    const hall = await this.hallService.getHallById(id);
    return this.apiResponse.success(res, hall);
  }

  async store(req: Request, res: Response) {
    const data = req.body as CreateHall;
    const hall = await this.hallService.createHall(data);
    return this.apiResponse.success(res, hall);
  }

  async update(req: Request, res: Response) {
    const id = req.params.id as string;
    const data = req.body as UpdateHall;
    const hall = await this.hallService.updateHall(id, data);
    return this.apiResponse.success(res, hall);
  }

  async delete(req: Request, res: Response) {
    const id = req.params.id as string;
    const hall = await this.hallService.deleteHallById(id);
    return this.apiResponse.success(res, hall);
  }
}
