// app/actions/studentActions.ts

"use server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
interface StudentData {
  studentId: string;
  LastName: string;
  FirstName: string;
  dateOfBirth: string;
  gender: "Male" | "Female" | "Other";
  placeOfBirth: string;
  guardianContact: string;
  grade?: string;
  class?: string;
  guardianName?: string;
}
export const createStudent = async (formData: FormData): Promise<{
  success: boolean;
  data?: StudentData;
  error?: string;
}> => {
  try {
    // Extract form fields
    const genderValue = formData.get("gender") as string;
    if (genderValue !== "Male" && genderValue !== "Female" && genderValue !== "Other") {
      throw new Error("Invalid gender value");
    }
    const studentData: StudentData = {
      studentId: formData.get("studentId") as string,
      LastName: formData.get("LastName") as string,
      FirstName: formData.get("FirstName") as string,
      dateOfBirth: formData.get("dateOfBirth") as string,
      gender: genderValue,
      placeOfBirth: formData.get("placeOfBirth") as string,
      guardianContact: formData.get("guardianContact") as string,
      grade: formData.get("grade") as string | undefined,
      class: formData.get("class") as string | undefined,
      guardianName: formData.get("guardianName") as string | undefined,
    };

    // Get authentication token from cookies
    const token = ( await cookies()).get("token")?.value;
    if (!token) {
      throw new Error("Authentication required");
    }

    // Send request to backend
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/student/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(studentData),
      }
    );

    // Handle response
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Student creation failed");
    }

    // Revalidate the students list cache
    revalidatePath("/admin/dashboard"); // Update this to your actual route

    const data = await response.json();
    return { success: true, data: data.data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};