import type { CreateShowTime, UpdateShowTime } from "../dto/showTime.dto";
import { ShowTimeService } from "../services/showTime.service";
import { ApiResponse } from "../utils/api-response";
import type { Request, Response } from "express";

export class ShowTimeController {
  private showTimeService;
  private apiResponse;

  constructor() {
    this.apiResponse = new ApiResponse();
    this.showTimeService = new ShowTimeService();
  }

  async index(req: Request, res: Response) {
    const date = req.query.date as string | undefined;
    const upcomingOnly = req.query.upcomingOnly === 'true';
    const showTimes = await this.showTimeService.getShowTimes(date, upcomingOnly);
    return this.apiResponse.success(res, showTimes);
  }

  async show(req: Request, res: Response) {
    const id = req.params.id as string;
    const showTime = await this.showTimeService.getShowTimeById(id);
    return this.apiResponse.success(res, showTime);
  }

  async store(req: Request, res: Response) {
    const data = req.body as CreateShowTime;
    const showTime = await this.showTimeService.createShowTime(data);
    return this.apiResponse.success(res, showTime);
  }

  async update(req: Request, res: Response) {
    const id = req.params.id as string;
    const data = req.body as UpdateShowTime;
    const showTime = await this.showTimeService.updateShowTime(id, data);
    return this.apiResponse.success(res, showTime);
  }

  async delete(req: Request, res: Response) {
    const id = req.params.id as string;
    const showTime = await this.showTimeService.deleteShowTimeById(id);
    return this.apiResponse.success(res, showTime);
  }

  async stats(req: Request, res: Response) {
    const id = req.params.id as string;
    const data = await this.showTimeService.getShowTimeStats(id);
    return this.apiResponse.success(res, data);
  }
}
