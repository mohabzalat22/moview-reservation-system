import type { CreateReservation, UpdateReservation, UpdateReservationStatus, ReservationStatus } from "../dto/reservation.dto";
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

  /**
   * Update reservation status.
   * - ADMIN can set any status (PENDING, CONFIRMED, CANCELLED).
   * - A USER (owner) can only set CANCELLED.
   */
  async updateReservationStatus(
    id: string,
    data: UpdateReservationStatus,
    requestingUserId: string,
    requestingUserRole: string
  ) {
    const reservation = await this.reservationRepository.findById(id);
    if (!reservation) {
      throw new Error("Reservation does not exist");
    }

    if (requestingUserRole === "ADMIN") {
      // Admin can set any status
      return this.reservationRepository.updateStatus(id, data);
    }

    // Regular user: must own the reservation AND can only cancel
    if (reservation.userId !== requestingUserId) {
      throw new Error("Forbidden: you do not own this reservation");
    }

    if (data.status !== "CANCELLED") {
      throw new Error("Forbidden: users can only cancel their own reservations");
    }

    return this.reservationRepository.updateStatus(id, data);
  }

  async deleteReservationById(id: string) {
    const reservationExists = await this.reservationRepository.findById(id);
    if (!reservationExists) {
      throw new Error("Reservation does not exist");
    }
    return this.reservationRepository.deleteById(id);
  }
}
