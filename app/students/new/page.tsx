'use client'
// app/students/new/page.tsx
import React, { useState } from 'react'
import { useRouter } from "next/navigation";
import { createStudent } from '@/app/actions/student/createStudentAction';
const NewStudentPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);


   async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(event.currentTarget)

    try {
      await createStudent(formData)
      setSuccess(true)
      event.currentTarget.reset(); // Reset the form on success
      router.push("/student")
    } catch (error : any) {
      setError(error.message || "An error occurred while creating the student");
    }finally{
      setLoading(false)
    }
   }
   return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create New Student</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && (
        <div className="text-green-500 mb-4">Student created successfully!</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="studentId" className="block font-medium mb-2">
            Student ID
          </label>
          <input
            type="text"
            id="studentId"
            name="studentId"
            required
            className="w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label htmlFor="firstName" className="block font-medium mb-2">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            required
            className="w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block font-medium mb-2">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            required
            className="w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label htmlFor="dateOfBirth" className="block font-medium mb-2">
            Date of Birth
          </label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            required
            className="w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label htmlFor="gender" className="block font-medium mb-2">
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            required
            className="w-full border-gray-300 rounded-md shadow-sm"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label htmlFor="placeOfBirth" className="block font-medium mb-2">
            Place of Birth
          </label>
          <input
            type="text"
            id="placeOfBirth"
            name="placeOfBirth"
            required
            className="w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label htmlFor="grade" className="block font-medium mb-2">
            Grade
          </label>
          <input
            type="text"
            id="grade"
            name="grade"
            className="w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label htmlFor="class" className="block font-medium mb-2">
            Class
          </label>
          <input
            type="text"
            id="class"
            name="class"
            className="w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label htmlFor="guardianName" className="block font-medium mb-2">
            Guardian Name
          </label>
          <input
            type="text"
            id="guardianName"
            name="guardianName"
            className="w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label htmlFor="guardianContact" className="block font-medium mb-2">
            Guardian Contact
          </label>
          <input
            type="text"
            id="guardianContact"
            name="guardianContact"
            required
            className="w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? "Creating..." : "Create Student"}
        </button>
      </form>
    </div>
  );
}

export default NewStudentPage