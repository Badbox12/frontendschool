// app/api/students/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";


export async function POST(request: NextRequest) {
  try {
    // Get authentication token from cookies
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Get student data from the request body
    const studentData = await request.json();
    
    // Forward request to Elysia backend
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/student/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` :''
        },
        body: JSON.stringify(studentData),
      }
    );

    // Handle backend errors
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    
    // Proxy the backend response
  return new NextResponse(response.body, {
    status: response.status,
    headers: {
      ...Object.fromEntries(response.headers.entries()),
    },
  });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}