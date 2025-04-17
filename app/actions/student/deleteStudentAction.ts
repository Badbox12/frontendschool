// app/actions/deleteStudentAction.ts
'use server';

import { cookies } from "next/headers";

export const deleteStudent = async (_id: string) => {
    try {
       const token = (await cookies()).get("token")?.value;
        if (!token) {
          throw new Error("Token not found. Please log in.");
        }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/student/${_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete student");
      }
  
      const result = await response.json();
      return result;
    } catch (error: any) {
      console.error("Error deleting student:", error.message);
      return { success: false, message: error.message };
    }
  };
  