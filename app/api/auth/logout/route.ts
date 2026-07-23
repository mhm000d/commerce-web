import { cookies } from "next/headers";

const API_BASE = process.env.API_BASE_URL;
const API_VERSION = process.env.API_VERSION;

export async function POST() {
  if (!API_VERSION) throw new Error("API_VERSION environment variable is not defined.");
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (refreshToken) {
    await fetch(`${API_BASE}/api/${API_VERSION}/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    }).catch(() => {});
  }

  cookieStore.delete("refresh_token");
  return new Response(null, { status: 204 });
}