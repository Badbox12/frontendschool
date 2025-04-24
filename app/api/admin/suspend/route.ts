import { NextRequest, NextResponse } from "next/server";

// POST expects body: { id: string }
export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing admin ID" }, { status: 400 });
    }

    const backendRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/${id}/suspend`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: req.headers.get("Authorization") || "",
      },
    });

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}