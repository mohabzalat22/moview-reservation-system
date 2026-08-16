import type { CreateSeat, UpdateSeat } from "../dto/seat.dto";
import { SeatService } from "../services/seat.service";
import { ApiResponse } from "../utils/api-response";
import type { Request, Response } from "express";

export class SeatController {
  private seatService;
  private apiResponse;

  constructor() {
    this.apiResponse = new ApiResponse();
    this.seatService = new SeatService();
  }

  async index(req: Request, res: Response) {
    const { sectionId } = req.query;
    if (sectionId) {
      const seats = await this.seatService.getSeatsBySectionId(sectionId as string);
      return this.apiResponse.success(res, seats);
    }
    const seats = await this.seatService.getSeats();
    return this.apiResponse.success(res, seats);
  }

  async show(req: Request, res: Response) {
    const id = req.params.id as string;
    const seat = await this.seatService.getSeatById(id);
    return this.apiResponse.success(res, seat);
  }

  async store(req: Request, res: Response) {
    const data = req.body as CreateSeat;
    const seat = await this.seatService.createSeat(data);
    return this.apiResponse.success(res, seat);
  }

  async update(req: Request, res: Response) {
    const id = req.params.id as string;
    const data = req.body as UpdateSeat;
    const seat = await this.seatService.updateSeat(id, data);
    return this.apiResponse.success(res, seat);
  }

  async delete(req: Request, res: Response) {
    const id = req.params.id as string;
    const seat = await this.seatService.deleteSeatById(id);
    return this.apiResponse.success(res, seat);
  }
}
