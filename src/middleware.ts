import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;

  const isDashboardRoute = nextUrl.pathname.startsWith("/dashboard");
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");

  // Bảo vệ route /admin: Yêu cầu đăng nhập và phải có role 'admin'
  if (isAdminRoute) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/login", nextUrl.origin);
      loginUrl.searchParams.set(
        "callbackUrl",
        nextUrl.pathname + nextUrl.search
      );
      return NextResponse.redirect(loginUrl);
    }

    if (userRole !== "admin") {
      // User thường truy cập vào /admin -> chuyển hướng đến trang /403
      return NextResponse.redirect(new URL("/403", nextUrl.origin));
    }
  }

  // Bảo vệ route /dashboard: Yêu cầu đăng nhập (user hoặc admin đều được vào)
  if (isDashboardRoute) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/login", nextUrl.origin);
      loginUrl.searchParams.set(
        "callbackUrl",
        nextUrl.pathname + nextUrl.search
      );
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
