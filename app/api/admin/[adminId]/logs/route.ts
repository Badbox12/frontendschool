import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { adminId: string } }) {
  const backendRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/${params.adminId}/logs`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: req.headers.get("Authorization") || "",
    },
  });
  const data = await backendRes.json();
  return NextResponse.json(data, { status: backendRes.status });
}