import { cookies } from "next/headers";

const API_BASE = process.env.API_BASE_URL;

export async function POST(req: Request) {
  const body = await req.text();

  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    return Response.json(data ?? { message: "Registration failed" }, { status: res.status });
  }

  const { accessToken, refreshToken, refreshTokenExpiresAt, user } = data;

  const cookieStore = await cookies();
  cookieStore.set("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(refreshTokenExpiresAt),
    path: "/",
  });

  return Response.json({ accessToken, user }, { status: 201 });
}