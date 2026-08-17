export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

let refreshPromise: Promise<string> | null = null;

export async function request<T>(
  path: string,
  token: string | null,
  options: RequestInit = {}
): Promise<T> {
  let currentToken = token;
  const getHeaders = (t: string | null) => ({
    "Content-Type": "application/json",
    ...(t ? { Authorization: `Bearer ${t}` } : {}),
    ...(options.headers as Record<string, string> | undefined),
  });

  options.credentials = "include";

  let res = await fetch(`${API_BASE}${path}`, { ...options, headers: getHeaders(currentToken) });

  if (res.status === 401 && currentToken && path !== '/auth/refresh') {
    if (!refreshPromise) {
      refreshPromise = fetch(`${API_BASE}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      }).then(async r => {
        const data = await r.json();
        if (!r.ok || !data.data?.accessToken) throw new Error("Refresh failed");
        
        localStorage.setItem("mrs_access_token", data.data.accessToken);
        window.dispatchEvent(new CustomEvent("mrs_token_refreshed", { detail: data.data.accessToken }));
        
        return data.data.accessToken;
      }).finally(() => {
        refreshPromise = null;
      });
    }

    try {
      currentToken = await refreshPromise;
      // retry original request
      res = await fetch(`${API_BASE}${path}`, { ...options, headers: getHeaders(currentToken) });
    } catch (err) {
      window.dispatchEvent(new Event("mrs_logout"));
      throw new Error("Session expired. Please log in again.");
    }
  }

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
