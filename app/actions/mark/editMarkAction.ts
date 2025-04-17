"use server";

interface EditMarkResult {
  success: boolean;
  error?: string;
  data?: any;
}

export async function editMark(formData: FormData): Promise<EditMarkResult> {
  try {
    const markId = formData.get("markId");
    if (!markId || typeof markId !== "string") {
      return { success: false, error: "Mark ID is required" };
    }

    // Convert numeric fields to numbers
    const marksObtained = Number(formData.get("marksObtained"));
    const maxMarks = Number(formData.get("maxMarks"));
    const yearValue = Number(formData.get("year")); // parse year as well

    // Debug: see if they're numbers or not
    //console.log("MarkId:", markId, "type:", typeof markId);
   

    // Build the payload
    const body = {
      subjectName: formData.get("subjectName"),
      marksObtained, // numeric
      maxMarks, // numeric
      month: formData.get("month"),
      year: !isNaN(yearValue) ? yearValue : undefined, // only set if valid
      teacherComments: formData.get("teacherComments"),
    };

    // Optional: Debug log to see the final payload
    //console.log("editMark payload:", body);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${API_URL}/marks/${markId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    // Check HTTP response status
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        // Attempt to parse any error response from the backend
        const errorData = await response.json();
        if (errorData.error) {
          errorMessage = errorData.error;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (_) {
        // If parsing fails, we keep the fallback errorMessage
      }
      return { success: false, error: errorMessage };
    }

    // Parse the backend's JSON response
    console.log("editMark response:", response.status, response.statusText);
    const result = await response.json();
    console.log("editMark result JSON:", result);
    if (!result.success) {
      return {
        success: false,
        error: result.error || "Update failed due to unknown error",
      };
    }

    // Return success with the updated data from the backend
    return { success: true, data: result.data };
  } catch (error: any) {
    console.error("Error in editMark:", error);
    return {
      success: false,
      error: error.message || "Failed to update mark due to unexpected error",
    };
  }
}
