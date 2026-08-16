import { request, Envelope } from "./core";
import type { Section, CreateSection } from "@/dto/section.dto";


export async function getSections(token?: string | null) {
  const env = await request<Envelope<Section[]>>("/sections", token ?? null);
  return env.data;
}

export async function createSection(token: string, data: CreateSection) {
  const env = await request<Envelope<Section>>("/sections", token, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return env.data;
}

export async function updateSection(token: string, id: string, data: Partial<CreateSection>) {
  const env = await request<Envelope<Section>>(`/sections/${id}`, token, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return env.data;
}

export async function deleteSection(token: string, id: string) {
  const env = await request<Envelope<Section>>(`/sections/${id}`, token, {
    method: "DELETE",
  });
  return env.data;
}
