import { request, Envelope } from "./core";
import type { Movie, CreateMovie } from "@/dto/movie.dto";


export async function getMovies(token?: string | null) {
  const env = await request<Envelope<Movie[]>>("/movies", token ?? null);
  return env.data;
}

export async function createMovie(token: string, data: CreateMovie) {
  const env = await request<Envelope<Movie>>("/movies", token, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return env.data;
}

export async function updateMovie(token: string, id: string, data: Partial<CreateMovie>) {
  const env = await request<Envelope<Movie>>(`/movies/${id}`, token, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return env.data;
}

export async function deleteMovie(token: string, id: string) {
  const env = await request<Envelope<Movie>>(`/movies/${id}`, token, {
    method: "DELETE",
  });
  return env.data;
}
