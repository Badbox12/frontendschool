// app/api/admin/login/route.ts
import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: Request) {
  const body = await request.json();
  // Extract CSRF token from incoming request headers
  const csrfToken = request.headers.get("x-csrf-token");
  try {
    // Call your backend API (adjust the URL as needed)
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/login`,
      body,
      {
        headers: {
          "x-csrf-token": csrfToken || "",
        },
      }
    );

    if (response.data.success) {
      console.log(response.data.data.super_token);
      // Create a response and set an HTTP-only session cookie
      const res = NextResponse.json(response.data, { status: 200 });
      // Check if superadmin (has super_token)
      if (response.data.data.super_token) {
        // For superadmin, set both tokens (regular token and super_token)
        res.cookies.set("token", response.data.data.super_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 3600,
          path: "/",
        });
        res.cookies.set("super_token", response.data.data.super_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 3600,
          path: "/",
        });
      } else {
        // For regular admin, just set token
        res.cookies.set("token", response.data.data.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 3600,
          path: "/",
        });
      }
      return res;
    } else {
      return NextResponse.json(
        { success: false, error: response.data.error },
        { status: 401 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.response?.data?.error || error.message },
      { status: error.response?.status || 500 }
    );
  }
}
