import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: Request) {
  try {
    // Parse the incoming JSON registration data.
    const body = await request.json();

    // Use your external API URL from environment variables.
   

    // Forward the registration request to the external API.
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/admin/register`, body);

    // If the external API indicates success, return that data with a 200 status.
    if (response.data.success) {
      return NextResponse.json(response.data, { status: 200 });
    } else {
      // Otherwise, return the error message from the external API with a 400 status.
      return NextResponse.json(response.data, { status: 400 });
    }
  } catch (error: any) {
    // Catch any errors (network, parsing, or external API errors) and return a 500 error.
    return NextResponse.json(
      { success: false, error: error.response?.data?.error || error.message },
      { status: error.response?.status || 500 }
    );
  }
}
