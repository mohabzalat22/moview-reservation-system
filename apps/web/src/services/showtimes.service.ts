import { request, Envelope } from "./core";
import type { ShowTime, CreateShowTime } from "@/dto/showTime.dto";


export async function getShowTimes(token?: string | null, date?: string, upcomingOnly: boolean = false) {
  const queryParams = new URLSearchParams();
  if (date) queryParams.append("date", date);
  if (upcomingOnly) queryParams.append("upcomingOnly", "true");
  
  const queryStr = queryParams.toString() ? `?${queryParams.toString()}` : "";
  const env = await request<Envelope<ShowTime[]>>(`/showtimes${queryStr}`, token ?? null);
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
