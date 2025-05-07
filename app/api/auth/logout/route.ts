// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  // Create a response that will clear the cookies
  const response = NextResponse.json({ success: true });
  
  // Clear both the token and super_token cookies
  response.cookies.set("token", "", {
    httpOnly: true,
    expires: new Date(0), // This immediately expires the cookie
    path: "/",
  });
  
  response.cookies.set("super_token", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });
  
  return response;
}