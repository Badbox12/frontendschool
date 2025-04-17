'use server';



interface DeleteMarkResult {
    success: boolean;
    error?: string;
    data?: any;
}


// Adjust your endpoint, environment variables, etc.
export async function deleteMark(markId: string): Promise<DeleteMarkResult> {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    try {
        const response = await fetch(`${API_URL}/marks/${markId}`, {
            method: "DELETE",
          });

          if (!response.ok) {
            throw new Error(`Failed to delete mark with ID: ${markId}`);
          }

          const result = await response.json()
          if (!result.success) {
            return { success: false, error: result.error || "Unknown error" };
          }

          return { success: true, data: result.data };
    } catch (err : any) {
        return { success: false, error: err.message };
    }
}


