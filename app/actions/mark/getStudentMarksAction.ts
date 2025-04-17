"use server"
import { cookies } from "next/headers";
import axios from "axios";
export const getStudentMarksAction = async (studentId : string) =>{
    try {
        const token = (await cookies()).get("token")?.value;
        if (!token) throw new Error("Unauthorized");

        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/student/${studentId}/marks`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            //console.log("Response data:", response.data.data);
            return response.data;
    } catch (error : any) {
        console.error("Error fetching marks:", error.message);
    throw new Error(error.message || "Failed to fetch marks");
    }
}