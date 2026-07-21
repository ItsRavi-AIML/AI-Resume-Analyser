import { NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth((request) => {
  const legacyToken = request.cookies.get("resume-ai-token");
  const protectedRoute = request.nextUrl.pathname.startsWith("/dashboard") || request.nextUrl.pathname.startsWith("/history");
  if (!legacyToken && !request.auth && protectedRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/history/:path*"]
};
