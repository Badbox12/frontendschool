//student-list.tsx
"use client";
import moment from "moment";

import "moment/locale/km";
moment.locale("km");
import { getStudentsAction } from "@/app/actions/student/readStudentAction";
import type { Student } from "@/types/student";
import { useEffect, useState, useRef, useOptimistic } from "react";
const API_URL = process.env.NEXT_PUBLIC_API_URL;
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { deleteStudent } from "@/app/actions/student/deleteStudentAction";
import { FaPlus, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import { useRouter } from "next/navigation";
import genderOptions from "@/app/utils/genderOptions";
import { editStudent } from "../../actions/student/editStudentAction";
import axios from "axios";
import { createStudent } from "@/app/actions/student/createStudentAction";
export default function StudentsList() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [optimisticStudents, setOptimisticStudents] = useOptimistic(students);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [studentId, setStudentId] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [sortBy, setSortBy] = useState<"FirstName" | "LastName">("FirstName");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  

  const sortStudents = (studentsToSort: Student[]) => {
    return studentsToSort.slice().sort((a, b)=>{
      const aName = a[sortBy]
      const bName = b[sortBy]
      const compareResult = aName.localeCompare(bName, "km");
      return sortDirection === "asc" ? compareResult : -compareResult;
    })
  }
  const openEditModal = (student: Student) => {
    setSelectedStudent(student);
    setStudentId(student._id);
    setIsModalOpen(true);
  };
 
  const openModal = () => {
    setIsModalOpen(true);
    generateStudentId();
  };
  const closeModal = () => setIsModalOpen(false);
  const generateStudentId = () => {
    const staticWord = "kork";
    const uniqueId = `${staticWord}${Math.floor(Math.random() * 1000000)}`;
    setStudentId(uniqueId);
  };
  const loadStudents = async () => {
    try {
       const response = await fetch("/api/student/all")
      if (!response.ok) {
        throw new Error("Failed to fetch students");
      }
      const student = await response.json();
      
       setStudents(student.data);
     
    } catch (error: any) {
       setError(error instanceof Error ? error.message : "Failed to load students");
    }
 };
  useEffect(() => {
     loadStudents();
    }, []);
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Use formRef instead of event.currentTarget
    if (!formRef.current) {
      console.error("Form reference is null");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (!event.currentTarget) {
      console.error("event.currentTarget is null");
      return;
    }

    try {
      const formData = new FormData(formRef.current);
      if (selectedStudent) {
        // Edit existing student
        const updatedData = Object.fromEntries(formData);
       // console.log("Updated data:", updatedData.firstName, updatedData.lastName);
        const result = await editStudent(selectedStudent._id, updatedData);
       // console.log("Edit student success:", result.success);
        if (result.success) {  
        toast.success("Student updated successfully!");
        await loadStudents();
        
          setIsModalOpen(false);
          setSelectedStudent(null);
        } else {
          throw new Error(result.error);
        }
      } else {
        // Create new student
      const result = await createStudent(formData);
      if (result.success) {
        toast.success("Student created successfully!");
        const newStudent = result.data
        setStudents((prev) => [...prev, newStudent as Student]);
        formRef.current.reset();
        setIsModalOpen(false);
      } else {
        throw new Error(result.error);
      }
        formRef.current.reset(); // Reset the form on success
        setIsModalOpen(false);
      }
    } catch (error: any) {
      setError(error.message || "An error occurred while creating the student");
      toast.error(error.message || "Error occurred!");
    } finally {
      setLoading(false);
    }
  }
  // Delete handler
  const handleDelete = async (_id: string) => {
    if (!window.confirm("Are you sure you want to delete this student?")) {
      return;
    }
    try {
      const result = await deleteStudent(_id);
      if (result.success) {
        toast.success("Student deleted successfully!");
        setStudents(prev => prev.filter(student => student._id !== _id));
      await loadStudents(); // Refresh the student list

      }
    } catch (error: any) {
      console.error("Error deleting student:", error.message);
      toast.error("Failed to delete student");
    }
  };
  // Confirm delete delete request
  const confirmDelete = async () => {
    if (!selectedStudent) return;
  };
  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <div className="container mx-auto p-4">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Students
        </h1>
        <button
          onClick={openModal}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          <FaPlus className="w-4 h-4" />
          <span>Create Student</span>
        </button>
      </div>
      {/*  Sort Control */}
      <div className="flex items-center mb-4 gap-2">
          <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
             <option value="FirstName">Sort by First Name (ក-អ)</option>
             <option value="LastName">Sort by Last Name (ក-អ)</option>
          </select>
          <button
          onClick={() => setSortDirection("asc")}
          className={`px-4 py-2 border rounded-lg ${
            sortDirection === "asc" ? "bg-blue-500 text-white" : ""
          }`}
        >
          A-Z (ក-អ)
        </button>
        <button
          onClick={() => setSortDirection("desc")}
          className={`px-4 py-2 border rounded-lg ${
            sortDirection === "desc" ? "bg-blue-500 text-white" : ""
          }`}
        >
          Z-A (អ-ក)
        </button>
      </div>
      {/* Student Table - Desktop */}
      <div className="hidden md:block overflow-x-auto rounded-lg shadow">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-base text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-4 py-3">
                ឈ្មោះសិស្ស
              </th>
              <th scope="col" className="px-4 py-3">
                ភេទ
              </th>
              <th scope="col" className="px-4 py-3">
                ថ្ងៃខែឆ្នាំកំណើត
              </th>
              <th scope="col" className="px-4 py-3">
                មកពីថ្នាក់ទី
              </th>
              <th scope="col" className="px-4 py-3">
                ទីកន្លែងកំណើត
              </th>
              <th scope="col" className="px-4 py-3">
                ឈ្មោះអាណាព្យាបាល
              </th>
              <th scope="col" className="px-4 py-3">
                ទំនាក់ទំនង
              </th>
              <th scope="col" className="px-4 py-3">
                សកម្មភាព
              </th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? (
              sortStudents(students).map((student, index) => (
                <tr
                  key={student.studentId}
                     
                  className={`border-b dark:border-gray-700 ${
                    index % 2 === 0
                      ? "bg-white dark:bg-gray-900"
                      : "bg-gray-50 dark:bg-gray-800"
                  }`}
                >
                  
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                    
                    {student.FirstName} {student.LastName}
                  </td>
                  <td className="px-4 py-3">{student.gender}</td>
                  <td className="px-4 py-3">
                    {moment(student.dateOfBirth).format("LL")}
                  </td>
                  <td className="px-4 py-3 ">{student.grade || "N/A"}</td>
                  <td className="px-4 py-3">{student.placeOfBirth}</td>
                  <td className="px-4 py-3">{student.guardianName}</td>
                  <td className="px-4 py-3">{student.guardianContact}</td>
                  <td className="px-4 py-3 gap-2 flex">
                    <button
                      className="text-blue-500 hover:text-blue-600 p-2 rounded-lg"
                      onClick={() => openEditModal(student)}
                    >
                      <FaEdit className="w-5 h-5" />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-600 p-2 rounded-lg"
                      onClick={() => handleDelete(student._id)}
                    >
                      <FaTrash className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={10}
                  style={{ textAlign: "center", paddingTop: "40px" }}
                >
                  No students found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Mobile Card */}
      <div className="md:hidden space-y-4">
        {students.length > 0 ? (
          students.map((student) => (
            <div
              key={student.studentId}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-4"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                 
                  {student.FirstName} {student.LastName}
                </h3>
                <div className="flex gap-2">
                  <button
                    className="text-blue-500 hover:text-blue-600"
                    onClick={() => openEditModal(student)}
                  >
                    <FaEdit className="w-5 h-5" />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-600"
                    onClick={() => handleDelete(student._id)}
                  >
                    <FaTrash className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-medium">ភេទ:</span> {student.gender}
                </p>
                <p>
                  <span className="font-medium">ថ្ងៃកំណើត:</span>{" "}
                  {moment(student.dateOfBirth).format("LL")}
                </p>
                <p>
                  <span className="font-medium">ថ្នាក់:</span>{" "}
                  {student.grade || "N/A"}
                </p>
                <p>
                  <span className="font-medium">ទីកន្លែងកំណើត:</span>{" "}
                  {student.placeOfBirth}
                </p>
                <p>
                  <span className="font-medium">អាណាព្យាបាល:</span>{" "}
                  {student.guardianName}
                </p>
                <p>
                  <span className="font-medium">ទំនាក់ទំនង:</span>{" "}
                  {student.guardianContact}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No students found
          </div>
        )}
      </div>
      {/* Modal for Create Student */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {selectedStudent ? "Edit Student" : "Create Student"}
                </h2>
                {error && <div className="text-red-500 mb-4">{error}</div>}
                {success && (
                  <div className="text-green-500 mb-4">
                    Student created successfully!
                  </div>
                )}
                <button
                  className=" text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedStudent(null);
                  }}
                >
                  <FaTimes className="w-6 h-6" />
                </button>
              </div>
              <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="max-w-md mx-auto p-4 rounded-md shadow grid grid-cols-2  gap-4"
              >
                <div className="space-y-2">
                  <label
                    htmlFor="studentId"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Student ID
                  </label>
                  <input
                    type="text"
                    id="studentId"
                    name="studentId"
                    value={studentId}
                    readOnly
                    required
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div>
                  <label
                    htmlFor="FirstName"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="FirstName"
                    name="FirstName"
                    required
                    defaultValue={selectedStudent?.FirstName || ""}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label
                    htmlFor="LastName"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="LastName"
                    name="LastName"
                    required
                    defaultValue={selectedStudent?.LastName || ""}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label
                    htmlFor="dateOfBirth"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    required
                    defaultValue={
                      selectedStudent?.dateOfBirth?.split("T")[0] || ""
                    }
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    onChange={(e) => setDateOfBirth(e.target.value)}
                  />
                  <div className="mt-2">
                    {dateOfBirth && (
                      <span className="text-gray-500 px-2 bg-gray-100 rounded-lg">
                        {moment(dateOfBirth).format("LL")}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="gender"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    required
                    defaultValue={selectedStudent?.gender || ""}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    {genderOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="placeOfBirth"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Place of Birth
                  </label>
                  <input
                    type="text"
                    id="placeOfBirth"
                    name="placeOfBirth"
                    defaultValue={selectedStudent?.placeOfBirth || ""}
                    required
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label
                    htmlFor="grade"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Grade
                  </label>
                  <input
                    type="text"
                    id="grade"
                    name="grade"
                    defaultValue={selectedStudent?.grade || ""}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label
                    htmlFor="class"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Class
                  </label>
                  <input
                    type="text"
                    id="class"
                    name="class"
                    defaultValue={selectedStudent?.class || ""}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label
                    htmlFor="guardianName"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Guardian Name
                  </label>
                  <input
                    type="text"
                    id="guardianName"
                    name="guardianName"
                    defaultValue={selectedStudent?.guardianName || ""}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label
                    htmlFor="guardianContact"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Guardian Contact
                  </label>
                  <input
                    type="text"
                    
                    id="guardianContact"
                    name="guardianContact"
                    required
                    defaultValue={selectedStudent?.guardianContact || ""}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div className="md:col-span-2 flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setSelectedStudent(null);
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:opacity-50"
                  >
                    {loading
                      ? selectedStudent
                        ? "Updating..."
                        : "Creating..."
                      : selectedStudent
                      ? "Update Student"
                      : "Create Student"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      <ToastContainer position="bottom-right" />
    </div>
  );
}
