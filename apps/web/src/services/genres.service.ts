import { request, Envelope } from "./core";
import type { Genre, CreateGenre } from "@/dto/genre.dto";


export async function getGenres(token: string) {
  const env = await request<Envelope<Genre[]>>("/genres", token);
  return env.data;
}

export async function createGenre(token: string, data: CreateGenre) {
  const env = await request<Envelope<Genre>>("/genres", token, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return env.data;
}

export async function updateGenre(token: string, id: string, data: Partial<CreateGenre>) {
  const env = await request<Envelope<Genre>>(`/genres/${id}`, token, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return env.data;
}

export async function deleteGenre(token: string, id: string) {
  const env = await request<Envelope<Genre>>(`/genres/${id}`, token, {
    method: "DELETE",
  });
  return env.data;
}
