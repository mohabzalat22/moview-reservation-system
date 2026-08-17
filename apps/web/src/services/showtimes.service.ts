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

export interface ShowTimeStats {
  showTimeId: string;
  movieTitle: string;
  hallName: string;
  showTimeStart: string;
  showTimeEnd: string;
  basePrice: number;
  baseCurrency: string;
  totalSeats: number;
  reservedSeats: number;
  availableSeats: number;
  occupancyRate: number;
  totalRevenue: number;
  sectionBreakdown: {
    sectionId: string;
    sectionName: string;
    additionPrice: number;
    totalSeats: number;
    reservedSeats: number;
    revenue: number;
  }[];
}

export async function getShowTimeStats(token: string, id: string): Promise<ShowTimeStats> {
  const env = await request<Envelope<ShowTimeStats>>(`/showtimes/${id}/stats`, token);
  return env.data;
}
