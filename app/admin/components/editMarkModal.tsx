"use client";

import { motion } from "framer-motion";
import { useState, useRef, FormEvent } from "react";
import type { Mark } from "@/types/mark";
import {editMark } from "@/app/actions/mark/editMarkAction";

interface EditMarkModalProps {
  closeModal: () => void;
  markToEdit: Mark;
  setError: (val: string | null) => void;
}

export default function EditMarkModal({
  closeModal,
  markToEdit,
  setError,
}: EditMarkModalProps) {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    try {
      setLoading(true);
      setError(null);

      const formData = new FormData(formRef.current);

      // Ensure the backend expects "markId" or "mark" as a field
      formData.set("markId", String(markToEdit._id));

      const result = await editMark(formData);
      if (!result.success) {
        throw new Error(result.error);
      }
      // On successful edit, close the modal (and maybe refresh marks?)
      closeModal();
    } catch (error: any) {
      setError(error.message);
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
          Edit Mark for {markToEdit.subjectName}
        </h3>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          {/* Subject field, marks, etc. pre-filled from markToEdit */}
          <div>
            <label className="block text-sm font-medium">Subject</label>
            <input
              name="subjectName"
              defaultValue={markToEdit.subjectName}
              className="border rounded px-3 py-2 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium">Marks</label>
              <input
                type="number"
                name="marksObtained"
                defaultValue={markToEdit.marksObtained}
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
                defaultValue={markToEdit.maxMarks}
                min={1}
                max={10}
                className="border rounded px-3 py-2 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>

          {/* Repeat for month, year, comments, etc. */}
          {/* Then the Submit button */}
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
              {loading ? "Updating..." : "Update Mark"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
