// app/api/students/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get authentication token from cookies
    const token = request.cookies.get("token")?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Forward request to Elysia backend
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/student/all`,
      {
        headers: {
          Authorization: token ? `Bearer ${token}` :''
        },
      }
    );
    // Return student data
    
    return new NextResponse(response.body, {
      status: response.status,
      headers: {
        ...Object.fromEntries(response.headers.entries()),
        'Content-Type': 'application/json', // Ensure correct content type
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}