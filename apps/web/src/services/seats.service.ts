import { request, Envelope } from "./core";
import type { Seat, CreateSeat } from "@/dto/seat.dto";


export async function getSeats(token: string) {
  const env = await request<Envelope<Seat[]>>("/seats", token);
  return env.data;
}

export async function createSeat(token: string, data: CreateSeat) {
  const env = await request<Envelope<Seat>>("/seats", token, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return env.data;
}

export async function updateSeat(token: string, id: string, data: Partial<CreateSeat>) {
  const env = await request<Envelope<Seat>>(`/seats/${id}`, token, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return env.data;
}

export async function deleteSeat(token: string, id: string) {
  const env = await request<Envelope<Seat>>(`/seats/${id}`, token, {
    method: "DELETE",
  });
  return env.data;
}
