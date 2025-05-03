// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  //console.log("Middleware is running for:", req.nextUrl.pathname);
  
  // If the user is accessing /admin/login and has a token, redirect them to the dashboard
  if (req.nextUrl.pathname === "/admin/login") {
    const token = req.cookies.get("token")?.value;
    if (token) {
      const dashboardUrl = req.nextUrl.clone();
      dashboardUrl.pathname = "/admin/dashboard";
      return NextResponse.redirect(dashboardUrl);
    }
  }
  
  // Protect all /admin routes except /admin/login
  if (
    req.nextUrl.pathname.startsWith("/admin") &&
    !req.nextUrl.pathname.startsWith("/admin/login") &&
    !req.nextUrl.pathname.startsWith("/admin/register") &&
    !req.nextUrl.pathname.startsWith("/admin/forgotpassword") &&
    !req.nextUrl.pathname.startsWith("/admin/confirm") &&
    !req.nextUrl.pathname.startsWith("/admin/otpverification") &&
    !req.nextUrl.pathname.startsWith("/admin/resetpassword")

  ) {
    const token = req.cookies.get("token")?.value;
    //console.log("Token from cookie:", token);
    if (!token) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      return NextResponse.redirect(loginUrl);
    }
  }
   // NEW: Protect /super-admin routes
   if (
    req.nextUrl.pathname.startsWith("/super-admin")
  ) {
    const superToken = req.cookies.get("super_token")?.value;
    if (!superToken) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/super-admin/login";
      return NextResponse.redirect(loginUrl);
    }
    // Optional: decode JWT/etc. here to check for a role
    // If you want, add a check for a "role" claim in the token
    // and redirect if user is not actually a super admin
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*","/super-admin/:path*",],
};
