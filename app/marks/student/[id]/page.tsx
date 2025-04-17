"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import type { Mark } from "@/types/mark";

export default function StudentMarks() {
  const [marks, setMarks] = useState<Mark[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  const {id} = useParams();
  //console.log(id) // if you prefer a dynamic route-based approach

   // if you prefer a query-based approach
  // OR if you do Next.js dynamic route: const router = useRouter(); const { studentId } = router.query;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("No studentId provided");
      return;
    }
    fetch(`${API_URL}/marks/student/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch student marks");
        return res.json();
      })
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setMarks(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);
  useEffect(() => {
    console.log(window.location.href)
  }, []);
  if (loading) return <p>Loading marks...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!marks.length) return <p>No marks found.</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
    <h1 className="text-2xl font-semibold text-gray-800 mb-6">Student Marks Overview</h1>
    <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-900 transition"
        >
          Back to Admin
        </button>
    </div>
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 bg-white">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marks</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {marks.map((mark) => (
            <tr key={mark._id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">{mark.subjectName}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{mark.marksObtained}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{mark.maxMarks}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {mark.grade}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{mark.month}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{mark.year}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  );
}
