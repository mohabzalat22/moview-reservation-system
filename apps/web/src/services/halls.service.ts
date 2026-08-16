import { request, Envelope } from "./core";
import type { Hall, CreateHall } from "@/dto/hall.dto";


export async function getHalls(token: string) {
  const env = await request<Envelope<Hall[]>>("/halls", token);
  return env.data;
}

export async function createHall(token: string, data: CreateHall) {
  const env = await request<Envelope<Hall>>("/halls", token, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return env.data;
}

export async function updateHall(token: string, id: string, data: Partial<CreateHall>) {
  const env = await request<Envelope<Hall>>(`/halls/${id}`, token, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return env.data;
}

export async function deleteHall(token: string, id: string) {
  const env = await request<Envelope<Hall>>(`/halls/${id}`, token, {
    method: "DELETE",
  });
  return env.data;
}
