import { NextResponse } from "next/server";
import axios from "axios";
import {cookies} from "next/headers";

export async function GET(request: Request) {
   // Retrieve the cookies using next/headers cookies function
   const token =( await cookies()).get("token")?.value;
  
   if (!token) {
     return NextResponse.json(
       { success: false, error: "Missing token" },
       { status: 401 }
     );
   }
  try {
    const externalApiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!externalApiUrl) throw new Error("EXTERNAL_API_URL is not defined");
   
    
    // Forward the GET request to your external backend's endpoint for fetching all admins.
    const response = await axios.get(`${externalApiUrl}/admin/all`,{
      headers: { Authorization: `Bearer ${token}` },
    });
    
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.response?.data?.error || error.message },
      { status: error.response?.status || 500 }
    );
  }
}
