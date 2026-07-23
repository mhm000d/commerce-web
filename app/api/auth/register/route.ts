import { cookies } from "next/headers";

const API_BASE = process.env.API_BASE_URL;
const API_VERSION = process.env.API_VERSION;

export async function POST(req: Request) {
  if (!API_VERSION) throw new Error("API_VERSION environment variable is not defined.");
  const body = await req.text();

  const res = await fetch(`${API_BASE}/api/${API_VERSION}/auth/register`, {
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