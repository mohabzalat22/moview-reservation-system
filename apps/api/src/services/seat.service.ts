import type { CreateSeat, UpdateSeat } from "../dto/seat.dto";
import { SeatRepository } from "../repositories/seat.repository";

export class SeatService {
  private seatRepository;

  constructor() {
    this.seatRepository = new SeatRepository();
  }

  async getSeats() {
    return this.seatRepository.findAll();
  }

  async getSeatsBySectionId(sectionId: string) {
    return this.seatRepository.findAllBySectionId(sectionId);
  }

  async getSeatById(id: string) {
    return this.seatRepository.findById(id);
  }

  async createSeat(data: CreateSeat) {
    return this.seatRepository.create(data);
  }

  async updateSeat(id: string, data: UpdateSeat) {
    const seatExists = await this.seatRepository.findById(id);
    if (!seatExists) {
      throw new Error("Seat does not exist");
    }
    return this.seatRepository.update(id, data);
  }

  async deleteSeatById(id: string) {
    const seatExists = await this.seatRepository.findById(id);
    if (!seatExists) {
      throw new Error("Seat does not exist");
    }
    return this.seatRepository.deleteById(id);
  }
}
