import { request, Envelope } from "./core";
import type { Reservation, CreateReservation } from "@/dto/reservation.dto";


export async function getReservations(token: string) {
  const env = await request<Envelope<Reservation[]>>("/reservations", token);
  return env.data;
}

export async function createReservation(token: string, data: CreateReservation) {
  const env = await request<Envelope<Reservation>>("/reservations", token, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return env.data;
}

export async function updateReservation(token: string, id: string, data: Partial<CreateReservation>) {
  const env = await request<Envelope<Reservation>>(`/reservations/${id}`, token, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return env.data;
}

export async function deleteReservation(token: string, id: string) {
  const env = await request<Envelope<Reservation>>(`/reservations/${id}`, token, {
    method: "DELETE",
  });
  return env.data;
}
