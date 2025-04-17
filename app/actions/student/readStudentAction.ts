'use server'

import { cookies } from "next/headers";


export async function getStudentsAction() {
    const token = (await cookies()).get("token")?.value;
    
    if (!token) {
      throw new Error("Token not found. Please log in.");
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL; // e.g., "http://localhost:4001"
    if (!API_URL) {
      throw new Error("API_URL environment variable is not defined.");
    }

    const res = await fetch(`${API_URL}/student/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store", // Always fetch fresh data
      });
    
      if (!res.ok) {
        // You might want to log or handle errors here.
        throw new Error("Failed to fetch students");
      }
    
      const data = await res.json();
      
      return data.data;
  
}