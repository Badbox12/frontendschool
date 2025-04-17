// src/types/student.ts

export interface Student {
    
    _id: string
    studentId: string;
    FirstName: string;
    LastName: string;
    dateOfBirth: string;  // ISO date string format (e.g., '2024-12-01')
    gender: 'Male' | 'Female' | 'Other';
    placeOfBirth: string;
    grade?: string;  // Optional field
    class?: string;  // Optional field
    guardianName?: string;  // Optional field
    guardianContact: string;
    createdAt: string;  // ISO date string
    updatedAt: string;  // ISO date string
  }
