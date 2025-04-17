import { NextResponse } from "next/server";
import axios from "axios";

// Fetch an admin by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const externalApiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!externalApiUrl) throw new Error("EXTERNAL_API_URL is not defined");

    const response = await axios.get(`${externalApiUrl}/admin/${params.id}`);
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.response?.data?.error || error.message },
      { status: error.response?.status || 500 }
    );
  }
}

// Update an admin by ID
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const externalApiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!externalApiUrl) throw new Error("EXTERNAL_API_URL is not defined");

    const response = await axios.patch(
      `${externalApiUrl}/admin/${params.id}`,
      body
    );
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.response?.data?.error || error.message },
      { status: error.response?.status || 500 }
    );
  }
}

// Delete an admin by ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const externalApiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!externalApiUrl) throw new Error("EXTERNAL_API_URL is not defined");

    const response = await axios.delete(`${externalApiUrl}/admin/${params.id}`);
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.response?.data?.error || error.message },
      { status: error.response?.status || 500 }
    );
  }
}
