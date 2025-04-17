import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const externalApiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!externalApiUrl) throw new Error("EXTERNAL_API_URL is not defined");

    // Forward the POST request to your external backend's create admin endpoint.
    const response = await axios.post(`${externalApiUrl}/admin/create`, body);
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.response?.data?.error || error.message },
      { status: error.response?.status || 500 }
    );
  }
}
