// app/actions/auth/verifyOTPAction.ts
'use server';
interface ControllerResponse {
    success: boolean;
    data?: any;
    error?: string;
  }
export async function verifyOTPAction(email: string, otp: string): Promise<ControllerResponse> {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    if (!API_URL) {
      return { success: false, error: 'API_URL is not defined.' };
    }

    const response = await fetch(`${API_URL}/admin/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp }),
    });

    if (!response.ok) {
      let errorMessage = `HTTP error: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch (jsonError) {
        console.error('Error parsing JSON:', jsonError);
      }
      return { success: false, error: errorMessage };
    }

    const result = await response.json();
    console.log('Result:', result);
    return { success: true, data: result.data }; // Expecting { token: string }
  } catch (error: any) {
    console.error('Error in verifyOTPAction:', error);
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      return { success: false, error: 'Network error, please try again.' };
    }
    return { success: false, error: error.message };
  }
}
