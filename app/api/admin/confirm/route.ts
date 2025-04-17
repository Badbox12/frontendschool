import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: Request) {
  // Extract token from the URL query parameters
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json(
      { success: false, error: "Missing token." },
      { status: 400 }
    );
  }

  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/confirm?token=${token}` );

   
      return NextResponse.json(response.data, { status: response.status });
  
  } catch (error: any) {
    return NextResponse.json(
        {
          success: false,
          error: error.response?.data?.error || error.message,
        },
        { status: error.response?.status || 500 }
      );
  }
}
