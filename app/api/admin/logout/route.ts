// app/api/admin/logout/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // Create a response that clears the "token" cookie by setting its maxAge to 0
  const response = NextResponse.json({ success: true, message: "Logged out" });
  response.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });
  return response;
}
