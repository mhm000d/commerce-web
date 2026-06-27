import {NextResponse} from "next/server";
import type {NextRequest} from "next/server";

export default function proxy(request: NextRequest) {
  const refreshToken = request.cookies.get("refresh_token")?.value;
  const {pathname} = request.nextUrl;

  const protectedPaths = ["/cart", "/orders", "/account", "/checkout"];
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));

  if (isProtected && !refreshToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/cart/:path*", "/orders/:path*", "/account/:path*", "/checkout/:path*"],
};