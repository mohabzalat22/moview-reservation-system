export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export async function request<T>(
  path: string,
  token: string | null,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> | undefined),
  };

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || json.error || "Request failed");
  }

  return json;
}

export interface Envelope<T> {
  status: string;
  message?: string;
  data: T;
}
