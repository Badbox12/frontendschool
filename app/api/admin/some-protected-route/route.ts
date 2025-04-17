// app/api/admin/some-protected-route/route.ts
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Your logic here
  const data = { message: "Protected data" };

  const response = NextResponse.json(data);
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  return response;
}
