"use server";

interface ControllerResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export async function resetPasswordAction(
  token: string,
  newPassword: string
): Promise<ControllerResponse> {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    if (!API_URL) {
      throw new Error("API_URL is not defined");
    }

    const response = await fetch(`${API_URL}/admin/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, newPassword }),
    });

    if (!response.ok) {
      let errorMessage = `HTTP error: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch (_) {}
      return { success: false, error: errorMessage };
    }

    const result = await response.json();
    return { success: true, data: 'Password reset successfully' };
  } catch (error: any) {
    console.error("Error in resetPasswordAction:", error);
    return { success: false, error: error.message };
  }
}
