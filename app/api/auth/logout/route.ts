import { cookies } from "next/headers";

const API_BASE = process.env.API_BASE_URL;

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (refreshToken) {
    await fetch(`${API_BASE}/api/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    }).catch(() => {});
  }

  cookieStore.delete("refresh_token");
  // cookieStore.delete("refresh_token", { path: "/" });
  return new Response(null, { status: 204 });
}