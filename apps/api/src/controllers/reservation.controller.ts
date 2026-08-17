import type { CreateReservation, UpdateReservation, UpdateReservationStatus } from "../dto/reservation.dto";
import { ReservationService } from "../services/reservation.service";
import { ApiResponse } from "../utils/api-response";
import type { Request, Response } from "express";

export class ReservationController {
  private reservationService;
  private apiResponse;

  constructor() {
    this.apiResponse = new ApiResponse();
    this.reservationService = new ReservationService();
  }

  async index(req: Request, res: Response) {
    const { userId, showTimeId } = req.query;
    if (userId) {
      const reservations = await this.reservationService.getReservationsByUserId(userId as string);
      return this.apiResponse.success(res, reservations);
    }
    if (showTimeId) {
      const reservations = await this.reservationService.getReservationsByShowTimeId(showTimeId as string);
      return this.apiResponse.success(res, reservations);
    }
    const reservations = await this.reservationService.getReservations();
    return this.apiResponse.success(res, reservations);
  }

  async show(req: Request, res: Response) {
    const id = req.params.id as string;
    const reservation = await this.reservationService.getReservationById(id);
    return this.apiResponse.success(res, reservation);
  }

  async store(req: Request, res: Response) {
    const data = req.body as CreateReservation;
    const reservation = await this.reservationService.createReservation(data);
    return this.apiResponse.success(res, reservation);
  }

  async update(req: Request, res: Response) {
    const id = req.params.id as string;
    const data = req.body as UpdateReservation;
    const reservation = await this.reservationService.updateReservation(id, data);
    return this.apiResponse.success(res, reservation);
  }

  async updateStatus(req: Request, res: Response) {
    const id = req.params.id as string;
    const data = req.body as UpdateReservationStatus;
    const requestingUserId = req.user!.id;
    const requestingUserRole = req.user!.role;

    try {
      const reservation = await this.reservationService.updateReservationStatus(
        id,
        data,
        requestingUserId,
        requestingUserRole
      );
      return this.apiResponse.success(res, reservation);
    } catch (err: unknown) {
      const message = (err as Error).message;
      if (message.startsWith("Forbidden")) {
        return this.apiResponse.forbidden(res, message);
      }
      return this.apiResponse.notFound(res, message);
    }
  }

  async delete(req: Request, res: Response) {
    const id = req.params.id as string;
    const reservation = await this.reservationService.deleteReservationById(id);
    return this.apiResponse.success(res, reservation);
  }
}
