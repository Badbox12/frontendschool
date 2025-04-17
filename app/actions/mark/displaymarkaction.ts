"use server";

 const displayAllMarks = async () => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
  try {
    const response = await fetch(`${API_URL}/marks`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to fetch marks");
    }

    return { success: true, data: result };
  } catch (error : any) {
    return { success: false, error: error.message };
  }
};

export default displayAllMarks;