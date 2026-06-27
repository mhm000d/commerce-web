const API_BASE = process.env.API_BASE_URL ?? "http://localhost:5082";

if (!API_BASE) throw new Error('API_BASE_URL is not defined. Add it to .env.local!');

export async function serverFetch<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(
      error?.message ?? `API ${res.status}: ${path}`
    );
  }

  if (res.status === 204) return undefined as T;

  return res.json();
}