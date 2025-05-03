import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { adminId: string } }) {
  const adminId = params.adminId;
  const backendRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/${adminId}/logs`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: req.headers.get("Authorization") || "",
    },
  });
  console.log("GET admin logs", backendRes.status);
  const data = await backendRes.json();
  return NextResponse.json(data, { status: backendRes.status });
}


