"use client";

import { useState, useRef, FormEvent } from "react";
import { motion } from "framer-motion";
import type { Student } from "@/types/student";
import type { Mark } from "@/types/mark";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaPlus, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
// Adjust imports to your actual file paths
import { editMark } from "@/app/actions/mark/editMarkAction";
import { deleteMark } from "@/app/actions/mark/deleteMarkAction";

interface ViewMarksModalProps {
  onClose: () => void;
  viewingStudent: Student;
  onRetry: () => void;
  error?: string | null;
  loadingMarks?: boolean; // True if globally fetching marks
  marks: Mark[];

  // Optional callback to re-fetch the updated marks from the parent
  // after an edit or delete
  onMarksUpdated?: () => void;
}

export default function ViewMarksModal({
  onClose,
  viewingStudent,
  onRetry,
  error,
  loadingMarks,
  marks,
  onMarksUpdated,
}: ViewMarksModalProps) {
  // For editing a mark
  const [editingMark, setEditingMark] = useState<Mark | null>(null);
  const editFormRef = useRef<HTMLFormElement>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // For confirming delete
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  function handleEditClick(mark: Mark): void {
    setEditingMark(mark);

    setEditError(null);
  }

  function handleCancelEdit() {
    setEditingMark(null);
    setEditError(null);
  }

  async function handleEditSubmit(e: FormEvent): Promise<void> {
    e.preventDefault();
    if (!editingMark || !editFormRef.current) return;

    try {
      setEditLoading(true);
      setEditError(null);

      const formData = new FormData(editFormRef.current);
      // Ensure 'markId' is set so the backend knows which Mark to update
      formData.set("markId", editingMark._id);

      const result = await editMark(formData);

      if (!result.success) {
        console.log(result.error);
        throw new Error(result.error);
      }

      toast.success("Mark updated successfully!");
      // On success, optionally refresh marks from parent
      onMarksUpdated?.();
      setEditingMark(null);
    } catch (err: any) {
      setEditError(`Error: ${err.message}`);
    } finally {
      setEditLoading(false);
    }
  }

  /* -------------------- DELETE LOGIC -------------------- */

  // Step 1: user clicks 'Delete' -> we set deleteConfirmId to show a confirm prompt
  function handleDeleteClick(markId: string) {
    setDeleteConfirmId(markId);
    setDeleteError(null);
  }

  // Step 2: user cancels
  function handleCancelDelete() {
    setDeleteConfirmId(null);
    setDeleteError(null);
  }

  // Step 3: user confirms
  async function handleConfirmDelete() {
    if (!deleteConfirmId) return;

    try {
      setDeleteLoading(true);
      setDeleteError(null);

      const result = await deleteMark(deleteConfirmId); // calls your deleteMarkAction
      if (!result.success) {
        throw new Error(result.error);
      }

      // On success, optionally refresh marks from parent
      onMarksUpdated?.();
      setDeleteConfirmId(null);
    } catch (err: any) {
      setDeleteError(err.message);
    } finally {
      setDeleteLoading(false);
    }
  }

  // If there's a loading state, show a spinner or placeholder
  if (loadingMarks && !error) {
    return (
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-lg p-6 relative flex flex-col items-center justify-center"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
          >
            &times;
          </button>
          <span className="inline-block w-6 h-6 border-4 border-blue-400 border-t-transparent animate-spin rounded-full" />
          <p className="mt-2 text-gray-600">Loading marks...</p>
        </motion.div>
      </motion.div>
    );
  }
  if (error) {
    return (
      <motion.div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl p-6 relative"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-gray-500 hover:text-gray-700 text-2xl"
          >
            &times;
          </button>
          <div className="text-center mt-4">
            <p className="text-red-500 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg inline-block">
              Error: {error}
            </p>
            <button
              onClick={() => {
                // Clear the error, then trigger parent to re-fetch
                onRetry();
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all mt-4 block mx-auto"
            >
              Retry Loading Marks
            </button>
          </div>

          {/* Skeleton Table */}
          <div className="overflow-auto rounded-lg border dark:border-gray-700 mt-6 animate-pulse">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/30">
                <tr>
                  {["Subject", "Marks", "Max", "Grade", "Month", "Year"].map(
                    (header) => (
                      <th
                        key={header}
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {[...Array(3)].map((_, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/20"
                  >
                    {[...Array(6)].map((_, cellIndex) => (
                      <td key={cellIndex} className="px-4 py-3">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    );
  }
  if (marks.length === 0) {
    return (
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-lg p-6 relative"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
          >
            &times;
          </button>
          <h3 className="text-lg font-bold mb-4">
            Marks for {viewingStudent.FirstName}
          </h3>
          {/* Skeleton for empty list */}
          <div className="overflow-auto max-h-80 animate-pulse space-y-2">
            <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-600 rounded-md mx-auto"></div>
            <div className="h-4 w-1/2 bg-gray-300 dark:bg-gray-600 rounded-md mx-auto"></div>
            <div className="h-4 w-2/3 bg-gray-300 dark:bg-gray-600 rounded-md mx-auto"></div>
          </div>
        </motion.div>
      </motion.div>
    );
  }
  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-lg p-6 relative"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
        >
          &times;
        </button>

        <h3 className="text-lg font-bold mb-4">
          Marks for {viewingStudent.FirstName} {"  "} {viewingStudent.LastName}
        </h3>

        {/* Show global error if any */}
        {error && <p className="text-red-500 mb-2">{error}</p>}

        {/* If editingMark is set, show the Edit Form */}
        {editingMark ? (
          <form
            ref={editFormRef}
            onSubmit={handleEditSubmit}
            className="space-y-4"
          >
            {editError && (
              <p className="text-red-500 hover:text-red-600">{editError}</p>
            )}
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium">Subject</label>
                <input
                  name="subjectName"
                  defaultValue={editingMark.subjectName}
                  className="border rounded px-3 py-2 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                  readOnly
                />
              </div>
              {/* <div className="flex-1">
                  <label className="block text-sm font-medium">Grade</label>
                  <input
                    name="grade"
                    defaultValue={editingMark.grade ?? ""}
                    className="border rounded px-3 py-2 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                    
                  />
                </div> */}
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium">Marks</label>
                <input
                  type="number"
                  name="marksObtained"
                  defaultValue={editingMark.marksObtained}
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
                  defaultValue={editingMark.maxMarks}
                  min={1}
                  max={10}
                  className="border rounded px-3 py-2 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium">Month</label>
                <input
                  name="month"
                  defaultValue={editingMark.month}
                  className="border rounded px-3 py-2 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium">Year</label>
                <input
                  type="number"
                  name="year"
                  defaultValue={editingMark.year}
                  min={2000}
                  max={new Date().getFullYear()}
                  className="border rounded px-3 py-2 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium">
                Teacher Comments
              </label>
              <textarea
                name="teacherComments"
                defaultValue={editingMark.teacherComments}
                className="border rounded px-3 py-2 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={editLoading}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition disabled:bg-gray-400"
              >
                {editLoading ? "Updating..." : "Save Changes"}
              </button>
            </div>
          </form>
        ) : loadingMarks ? (
          // If currently loading marks
          <div className="text-center">
            <span className="inline-block w-6 h-6 border-4 border-blue-400 border-t-transparent animate-spin rounded-full" />
            <p>Loading marks...</p>
          </div>
        ) : (
          // VIEW MARKS TABLE
          <div className="overflow-auto max-h-80">
            {marks.length === 0 ? (
              <p>No marks found</p>
            ) : (
              <table className="w-full text-left border text-sm">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700">
                    <th className="px-3 py-2 border">Subject</th>
                    <th className="px-3 py-2 border">Marks</th>
                    <th className="px-3 py-2 border">Max</th>
                    <th className="px-3 py-2 border">Grade</th>
                    <th className="px-3 py-2 border">Month</th>
                    <th className="px-3 py-2 border">Year</th>
                    <th className="px-3 py-2 border text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {marks.map((m) => (
                    <tr
                      key={m._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="border px-3 py-2">{m.subjectName}</td>
                      <td className="border px-3 py-2">{m.marksObtained}</td>
                      <td className="border px-3 py-2">{m.maxMarks}</td>
                      <td className="border px-3 py-2">{m.grade}</td>
                      <td className="border px-3 py-2">{m.month}</td>
                      <td className="border px-3 py-2">{m.year}</td>
                      <td className="border px-3 py-2 text-center flex gap-1 justify-center">
                        <button
                          onClick={() => handleEditClick(m)}
                          className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition"
                        >
                          <FaEdit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(m._id)}
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                        >
                          <FaTrash className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* DELETE CONFIRM UI */}
        {deleteConfirmId && (
          <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-sm relative">
              <button
                onClick={handleCancelDelete}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
              >
                &times;
              </button>
              <p className="text-gray-800 dark:text-gray-100 mb-4">
                Are you sure you want to delete this mark?
              </p>
              {deleteError && (
                <p className="text-red-500 mb-2">{deleteError}</p>
              )}
              <div className="flex justify-end gap-2">
                <button
                  onClick={handleCancelDelete}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={deleteLoading}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition disabled:bg-gray-400"
                >
                  {deleteLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
