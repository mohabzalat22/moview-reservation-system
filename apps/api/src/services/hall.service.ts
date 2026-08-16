import type { CreateHall, UpdateHall } from "../dto/hall.dto";
import { HallRepository } from "../repositories/hall.repository";

export class HallService {
  private hallRepository;

  constructor() {
    this.hallRepository = new HallRepository();
  }

  async getHalls() {
    return this.hallRepository.findAll();
  }

  async getHallById(id: string) {
    return this.hallRepository.findById(id);
  }

  async createHall(data: CreateHall) {
    return this.hallRepository.create(data);
  }

  async updateHall(id: string, data: UpdateHall) {
    const hallExists = await this.hallRepository.findById(id);
    if (!hallExists) {
      throw new Error("Hall does not exist");
    }
    return this.hallRepository.update(id, data);
  }

  async deleteHallById(id: string) {
    const hallExists = await this.hallRepository.findById(id);
    if (!hallExists) {
      throw new Error("Hall does not exist");
    }
    return this.hallRepository.deleteById(id);
  }
}
