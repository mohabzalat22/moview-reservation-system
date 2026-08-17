const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export interface AuthResult {
  user: { id: string; email: string; role: string; name?: string };
  accessToken: string;
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    credentials: "include",
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || data.error || "Request failed");
  }

  return data;
}

// Backend wraps responses: { status, message, data }
interface ApiEnvelope<T> {
  status: string;
  message?: string;
  data: T;
}

export async function loginApi(email: string, password: string) {
  const envelope = await request<ApiEnvelope<AuthResult>>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  return envelope.data;
}

export async function registerApi(
  name: string,
  email: string,
  password: string
) {
  const envelope = await request<ApiEnvelope<AuthResult>>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
  return envelope.data;
}

export async function getMeApi(accessToken: string) {
  const envelope = await request<ApiEnvelope<{ userId: string }>>(
    "/auth/me",
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  return envelope.data;
}

export async function refreshTokenApi() {
  const envelope = await request<ApiEnvelope<{ accessToken: string }>>(
    "/auth/refresh",
    {
      method: "POST",
    }
  );
  return envelope.data;
}

export async function logoutApi() {
  const envelope = await request<ApiEnvelope<null>>("/auth/logout", {
    method: "POST",
  });
  return envelope;
}
