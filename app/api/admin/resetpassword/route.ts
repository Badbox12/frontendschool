// app/api/admin/resetpassword/route.ts
import { NextResponse } from "next/server";
import axios from "axios";
export async function POST(request: Request) {
  try {
    // Validate request body
    const body = await request.json();
    const { token, newPassword } = body;

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: "Token and new password are required" },
        { status: 400 }
      );
    }

    // Forward request to Elysia backend
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/reset-password`,
      {
        token,
        newPassword,
      }
    );
    // Handle successful response
    if (response.data.success) {
      return NextResponse.json({
        success: true,
        message: response.data.message || "Password reset successful",
      });
    } else {
      return NextResponse.json(
        { error: response.data.error || "Password reset failed" },
        { status: response.status || 500 }
      );
    }
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
