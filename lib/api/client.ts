const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE) throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined. Add it to your environment (.env.local for dev, .env on Vercel)!');

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