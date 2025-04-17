"use client";

import { useState, useEffect } from "react";
//import { insertMark } from "@/app/actions/mark/insertMarkAction";
import { useRouter } from "next/navigation";

import { AnimatePresence } from "framer-motion";

// Types (adjust import paths/types to match your project)
import type { Student } from "@/types/student";
import type { Mark } from "@/types/mark";
// Import our separate modal components
import InsertMarkModal from "./InsertMarkModal";
import ViewMarksModal from "./ViewMarksModal";
import SkenletonLoader from "./skeletonLoader";
import { getStudentMarksAction } from "@/app/actions/mark/getStudentMarksAction";

export default function StudentMarkList() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [marks, setMarks] = useState<Mark[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // For inserting marks
  const [isInsertModalOpen, setIsInsertModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // For viewing marks
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // The function we will pass down
  async function fetchMarksAgain(forStudent: Student | null = null) {
    const targetStudent = forStudent || viewingStudent;
    if (!targetStudent) return;

    try {
      setLoading(true);
      setError(null);
      //console.log("Fetching marks for student:", targetStudent._id);
      const markData = await getStudentMarksAction(targetStudent._id);
      // console.log("Mark data:", markData.success);
      if(markData.success){
        setMarks(markData.data);
      }else{
        throw new Error(markData.error || "Failed to fetch marks");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  // Fetch students data on the client
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/student/all")

      if (!response.ok) {
        throw new Error("Failed to fetch students");
      }

      const result = await response.json();
      //console.log(result.data);
      if (result.success) {
        setStudents(result.data);
      } else {
        setError("Invalid API response");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    //console.log(window.location.href)

    fetchStudents();
  }, []);

  
  const onRetry = () => {
    setError(null);
    fetchStudents();
  };
  const openInsertMarkModal = (student: Student) => {
    setSelectedStudent(student);
    setIsInsertModalOpen(true);
    setError(null);
  };

  // Close the insert mark modal
  const closeInsertMarkModal = () => {
    setSelectedStudent(null);
    setIsInsertModalOpen(false);
    setError(null);
  };
  // Close the view mark modal
  const closeViewMarkModal = () => {
    setViewingStudent(null);
    setIsViewModalOpen(false);
    setMarks([]);
    setError(null);
  };
  // Open the view mark modal + fetch that student's marks
  const openViewMarkModal = async (student: Student) => {
    if (!student._id) {
      setError("Invalid student ID");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      setViewingStudent(student);

      await fetchMarksAgain(student);
      setIsViewModalOpen(true);
      // const res = await fetch(`${API_URL}/marks/student/${student._id}`, {
      //   cache: "no-store", // Always fetch fresh data
      // });
      // if (!res.ok) {
      //   throw new Error("Failed to fetch student marks");
      // }

      // const data = await res.json();

      // // Adjust if your API returns { error: string; data: Mark[] }
      // if (data.error) throw new Error(data.error);

      // // Or `setMarks(data.data)` if your backend structure is different
      // setMarks(data);
      // setIsViewModalOpen(true);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  // const handleInsertMark = async (e: FormEvent) => {
  //   e.preventDefault();
  //   if (!formRef.current || !selectedStudent) return;

  //   setLoading(true);
  //   setError(null);

  //   try {
  //     const formData = new FormData(formRef.current);

  //     formData.set("studentId", selectedStudent._id); // Ensure student _id is used

  //     const result = await insertMark(formData);
  //     if (!result.success) throw new Error(result.error);
  //     closeModal();
  //     // Optionally re-fetch data if needed
  //     // await fetchStudents();
  //   } catch (err: any) {
  //     setError(err.message);
  //   }
  //   setLoading(false);
  // };

  if (loading && !isInsertModalOpen && !isViewModalOpen) {
    return (
      <div className="py-6 text-center">
        <span className="inline-block w-8 h-8 border-4 border-blue-400 border-t-transparent animate-spin rounded-full"></span>
        <p className="mt-2 text-gray-600">Loading students...</p>
      </div>
    );
  }

  // if (error && !isInsertModalOpen && !isViewModalOpen) {
  //   return (
  //     <div className="mt-4 max-w-6xl mx-auto">
  //       <div className="text-center">
  //         <p className="text-red-500 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg inline-block">
  //           Error: {error}
  //         </p>
  //         <button
  //           onClick={() => {
  //             setError(null);
  //             fetchStudents();
  //           }}
  //           className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all mt-4 block mx-auto"
  //         >
  //           Retry Loading Marks
  //         </button>
  //       </div>

  //       {/* Skeleton Table */}
  //       <div className="overflow-auto rounded-lg border dark:border-gray-700 mt-6">
  //         <table className="w-full animate-pulse">
  //           <thead className="bg-gray-50 dark:bg-gray-700/30">
  //             <tr>
  //               {["Subject", "Marks", "Max", "Grade", "Month", "Year"].map(
  //                 (header) => (
  //                   <th
  //                     key={header}
  //                     className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
  //                   >
  //                     {header}
  //                   </th>
  //                 )
  //               )}
  //             </tr>
  //           </thead>
  //           <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
  //             {[...Array(3)].map((_, rowIndex) => (
  //               <tr
  //                 key={rowIndex}
  //                 className="hover:bg-gray-50 dark:hover:bg-gray-700/20"
  //               >
  //                 {[...Array(6)].map((_, cellIndex) => (
  //                   <td key={cellIndex} className="px-4 py-3">
  //                     <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
  //                   </td>
  //                 ))}
  //               </tr>
  //             ))}
  //           </tbody>
  //         </table>
  //       </div>
  //     </div>
  //   );
  // }

  // if (students.length === 0) {
  //   return (
  //     <div className="p-8 text-center text-gray-500 dark:text-gray-400">
  //       No students found
  //     </div>
  //   );
  // }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-extrabold mb-6 text-gray-800 dark:text-white">
        All Students
      </h1>
      {students.length === 0 ? (
        <div className="overflow-auto max-h-80 animate-pulse space-y-2">
          {/* Example skeleton bars; adjust as needed */}
          <SkenletonLoader />
        </div>
      ) : (
        <div className="overflow-x-auto  rounded-lg shadow-md">
          <table className="w-full border-collapse text-sm text-left text-gray-600 dark:text-gray-300">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 font-medium border-b dark:border-gray-600">
                  Student ID
                </th>
                <th className="px-4 py-3 font-medium border-b dark:border-gray-600">
                  Name
                </th>
                <th className="px-4 py-3 font-medium border-b dark:border-gray-600">
                  Grade
                </th>
                <th className="px-4 py-3 font-medium border-b grid grid-rows-2 dark:border-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
              {students.map((student) => (
                <tr
                  key={student._id}
                  className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-4 py-3 border-b dark:border-gray-700">
                    {student.studentId}
                  </td>
                  <td className="px-4 py-3 border-b dark:border-gray-700">
                    {student.FirstName} {student.LastName}
                  </td>
                  <td className="px-4 py-3 border-b dark:border-gray-700">
                    {student.grade}
                  </td>

                  <td className="px-4 py-3 border-b dark:border-gray-700 text-center gap-2 flex">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      onClick={() => {
                        // router.push(`/marks/student/${student._id}`);
                        openViewMarkModal(student);
                        //console.log("Navigating to:", `/marks/student/${student._id}`);
                      }}
                    >
                      View Marks
                    </button>
                    <button
                      onClick={() => openInsertMarkModal(student)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition shadow-sm"
                    >
                      Insert Mark
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}



      <AnimatePresence>
        {isViewModalOpen && viewingStudent && (
          <ViewMarksModal
            onClose={closeViewMarkModal}
            viewingStudent={viewingStudent}
            onRetry={onRetry}
            marks={marks}
            error={error}
            loadingMarks={loading}
            onMarksUpdated={fetchMarksAgain}
          />
        )}
      </AnimatePresence>
      {/* Insert Mark Modal */}
      <AnimatePresence>
        {isInsertModalOpen && selectedStudent && (
          <InsertMarkModal
            closeModal={closeInsertMarkModal}
            selectedStudent={selectedStudent}
            setError={setError}
          />
        )}
      </AnimatePresence>

    
    </div>
  );
}
