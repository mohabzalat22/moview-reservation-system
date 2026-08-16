import type { CreateReservation, UpdateReservation } from "../dto/reservation.dto";
import { ReservationRepository } from "../repositories/reservation.repository";

export class ReservationService {
  private reservationRepository;

  constructor() {
    this.reservationRepository = new ReservationRepository();
  }

  async getReservations() {
    return this.reservationRepository.findAll();
  }

  async getReservationsByUserId(userId: string) {
    return this.reservationRepository.findAllByUserId(userId);
  }

  async getReservationsByShowTimeId(showTimeId: string) {
    return this.reservationRepository.findAllByShowTimeId(showTimeId);
  }

  async getReservationById(id: string) {
    return this.reservationRepository.findById(id);
  }

  async createReservation(data: CreateReservation) {
    return this.reservationRepository.create(data);
  }

  async updateReservation(id: string, data: UpdateReservation) {
    const reservationExists = await this.reservationRepository.findById(id);
    if (!reservationExists) {
      throw new Error("Reservation does not exist");
    }
    return this.reservationRepository.update(id, data);
  }

  async deleteReservationById(id: string) {
    const reservationExists = await this.reservationRepository.findById(id);
    if (!reservationExists) {
      throw new Error("Reservation does not exist");
    }
    return this.reservationRepository.deleteById(id);
  }
}
