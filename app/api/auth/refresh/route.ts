import { cookies } from "next/headers";

const API_BASE = process.env.API_BASE_URL;

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!refreshToken) {
    return Response.json({ message: "No refresh token" }, { status: 401 });
  }

  const res = await fetch(`${API_BASE}/api/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    cookieStore.delete("refresh_token");
    return Response.json({ message: "Refresh failed" }, { status: 401 });
  }

  const data = await res.json();
  const { accessToken, refreshToken: newRefreshToken, refreshTokenExpiresAt, user } = data;

  // Rotation — backend issues a new refresh token every call, cookie must follow
  cookieStore.set("refresh_token", newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(refreshTokenExpiresAt),
    path: "/",
  });

  return Response.json({ accessToken, user });
}