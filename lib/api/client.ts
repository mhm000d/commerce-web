export async function serverFetch<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
  const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION;

  if (!API_BASE) throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined. Add it to your environment (.env.local for dev, .env on Vercel)!');
  if (!API_VERSION) throw new Error('NEXT_PUBLIC_API_VERSION is not defined. Add it to your environment (.env.local for dev, .env on Vercel)!');

  const normalizedPath = path.startsWith("/api/")
    ? path.replace("/api/", `/api/${API_VERSION}/`)
    : path;

  const res = await fetch(`${API_BASE}${normalizedPath}`, {
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