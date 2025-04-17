"use server";
import type { Student } from "@/types/student";
import { cookies } from "next/headers";

interface EditStudentResult {
  success: boolean;
  data?: Student;
  error?: string;
  statusCode?: number;
}

export async function editStudent(
  id: string,
  updatedData: Partial<Student>
): Promise<EditStudentResult> {
  // Validate input parameters
  if (!id?.trim()) {
    return { success: false, error: "Invalid student ID", statusCode: 400 };
  }

  if (!updatedData || Object.keys(updatedData).length === 0) {
    return { success: false, error: "No update data provided", statusCode: 400 };
  }

  // Ensure API URL is set
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  if (!API_URL) {
    console.error("API_URL environment variable not configured");
    return { success: false, error: "Server configuration error", statusCode: 500 };
  }

  try {
    const token = (await cookies()).get("token")?.value;
      if (!token) {
        throw new Error("Token not found. Please log in.");
      }
    const endpoint = `${API_URL}/student/${id}`;
    const response = await fetch(endpoint, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },

      body: JSON.stringify(updatedData),
    });

    const responseBody = await response.json().catch(() => null); // Handle non-JSON responses

    if (!response.ok) {
      return {
        success: false,
        error: responseBody?.error || `Failed to update student (${response.status})`,
        statusCode: response.status,
      };
    }

    return {
      success: true,
      data: responseBody as Student, // Ensure type matches
    };
  } catch (error) {
    console.error("Error updating student:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
      statusCode: 500,
    };
  }
}
