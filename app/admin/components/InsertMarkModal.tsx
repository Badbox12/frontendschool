"use client";

import { motion } from "framer-motion";
import { useState, useRef, FormEvent } from "react";
import type { Student } from "@/types/student";
import { insertMark } from "@/app/actions/mark/insertMarkAction";

import { allowedSubjects } from "@/app/utils/allowSubjects";
interface InsertMarkModalProps {
  closeModal: () => void;
  selectedStudent: Student;
  setError: (val: string | null) => void;
}

export default function InsertMarkModal({
  closeModal,
  selectedStudent,
  setError,
}: InsertMarkModalProps) {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Placeholder subjects - adjust as needed
 

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    try {
      setLoading(true);
      setError(null);

      const formData = new FormData(formRef.current);
      // Ensure the backend expects "studentId" or "student" as a field
      formData.set("studentId", selectedStudent._id);

      // Import the insertMark function
     
      const result = await insertMark(formData);
      if (!result.success) {
        throw new Error(result.error);
      }

      // On successful insert, close the modal (and maybe refresh marks?)
      closeModal();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6 relative"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
      >
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
        >
          &times;
        </button>
        <h3 className="text-lg font-bold mb-4">
          Insert Mark for {selectedStudent.FirstName}
        </h3>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          {/* Subject Dropdown */}
          <div>
            <label className="block text-sm font-medium">Subject</label>
            <select
              name="subjectName"
              className="border rounded px-3 py-2 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            >
              <option value="">-- Select Subject --</option>
              {allowedSubjects.map((subj) => (
                <option key={subj} value={subj}>
                  {subj}
                </option>
              ))}
            </select>
          </div>

          {/* Marks fields */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium">Marks</label>
              <input
                type="number"
                name="marksObtained"
                min={0}
                max={10}
                required
                className="border rounded px-3 py-2 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium">Max</label>
              <input
                type="number"
                name="maxMarks"
                defaultValue="10"
                min={1}
                max={10}
                className="border rounded px-3 py-2 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>

          {/* Month / Year */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium">Month</label>
              <select
                name="month"
                className="border rounded px-3 py-2 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                {[
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ].map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium">Year</label>
              <input
                type="number"
                name="year"
                defaultValue={new Date().getFullYear()}
                min={2000}
                max={new Date().getFullYear()}
                className="border rounded px-3 py-2 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>

          {/* Comments */}
          <div>
            <label className="block text-sm font-medium">Teacher Comments</label>
            <textarea
              name="teacherComments"
              className="border rounded px-3 py-2 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={closeModal}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition disabled:bg-gray-400"
            >
              {loading ? "Saving..." : "Save Mark"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
