"use server";

export async function insertMark(formData: FormData) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  if (!API_URL) {
    throw new Error("API URL is not defined in environment");
  }

  // Convert formData entries to the mark object
  const markData = {
    studentId: formData.get("studentId"),
    subjectName: formData.get("subjectName"),
    // Parse numeric fields
    marksObtained: Number(formData.get("marksObtained")),
    maxMarks: Number(formData.get("maxMarks")) || 10,
    month: formData.get("month"),
    year: Number(formData.get("year")),
    teacherComments: formData.get("teacherComments") || "",
  };

  try {
    const response = await fetch(`${API_URL}/marks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(markData),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || "Failed to insert mark");
    }

    return result;
  } catch (error: any) {
    console.error("Error in insertMark:", error);
    throw new Error(error.message);
  }
}
