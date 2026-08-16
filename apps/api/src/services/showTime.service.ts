import type { CreateShowTime, UpdateShowTime } from "../dto/showTime.dto";
import { ShowTimeRepository } from "../repositories/showTIme.repository";

export class ShowTimeService {
  private showTimeRepository;

  constructor() {
    this.showTimeRepository = new ShowTimeRepository();
  }

  async getShowTimes(date?: string, upcomingOnly?: boolean) {
    return this.showTimeRepository.findAll(date, upcomingOnly);
  }

  async getShowTimeById(id: string) {
    return this.showTimeRepository.findById(id);
  }

  async createShowTime(data: CreateShowTime) {
    return this.showTimeRepository.create(data);
  }

  async updateShowTime(id: string, data: UpdateShowTime) {
    const showTimeExists = await this.showTimeRepository.findById(id);
    if (!showTimeExists) {
      throw new Error("ShowTime does not exist");
    }
    return this.showTimeRepository.update(id, data);
  }

  async deleteShowTimeById(id: string) {
    const showTimeExists = await this.showTimeRepository.findById(id);
    if (!showTimeExists) {
      throw new Error("ShowTime does not exist");
    }
    return this.showTimeRepository.deleteById(id);
  }
}
