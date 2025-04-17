// app/lib/apiClient.ts
import axios, { AxiosError } from 'axios';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Create a base instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth headers
apiClient.interceptors.request.use(
  async (config) => {
    const token = (await cookies()).get('token')?.value;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 401) {
        // Handle unauthorized (token expired?)
        // You can redirect to login here
      }
      return Promise.reject((data as { error?: string }).error || error.message);
    }
    return Promise.reject(error.message);
  }
);

// Export specific methods with typed responses
export const api = {
  // Students
  getStudents: async () => {
    const response = await apiClient.get('/student/all');
    return response.data.data as Student[];
  },
  createStudent: async (data: FormData) => {
    const response = await apiClient.post('/student/create', data);
    return response.data.data as Student;
  },
  updateStudent: async (id: string, data: FormData) => {
    const response = await apiClient.patch(`/student/${id}`, data);
    return response.data.data as Student;
  },
  deleteStudent: async (id: string) => {
    const response = await apiClient.delete(`/student/${id}`);
    return response.data.data as Student;
  },

  // Add other endpoints here (marks, admins, etc.)
};

// Types
export interface Student {
  _id: string;
  studentId: string;
  FirstName: string;
  LastName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  placeOfBirth: string;
  grade?: string;
  class?: string;
  guardianName?: string;
  guardianContact: string;
}