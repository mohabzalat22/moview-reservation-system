import { request, Envelope } from "./core";
import type { ShowTime, CreateShowTime } from "@/dto/showTime.dto";


export async function getShowTimes(token: string) {
  const env = await request<Envelope<ShowTime[]>>("/showtimes", token);
  return env.data;
}

export async function createShowTime(token: string, data: CreateShowTime) {
  const env = await request<Envelope<ShowTime>>("/showtimes", token, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return env.data;
}

export async function updateShowTime(token: string, id: string, data: Partial<CreateShowTime>) {
  const env = await request<Envelope<ShowTime>>(`/showtimes/${id}`, token, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return env.data;
}

export async function deleteShowTime(token: string, id: string) {
  const env = await request<Envelope<ShowTime>>(`/showtimes/${id}`, token, {
    method: "DELETE",
  });
  return env.data;
}
