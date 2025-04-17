import type { Student } from "@/types/student";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
async function fetchStudents(): Promise<Student[]> {
  const response = await fetch(`${API_URL}/students`, {
    cache: "no-store", // Ensures fresh data is fetched
  });

  if (!response.ok) {
    throw new Error("Failed to fetch students");
  }

  const result = await response.json();
  // Debug the structure of the result
  //console.log("API response:", result);
  // Extract the `data` property, assuming `success` is true
  if (result.success && Array.isArray(result.data)) {
    return result.data;
  } else {
    throw new Error("Invalid API response structure");
  }
}
const Student = async () => {
  const students = await fetchStudents();
  return (
    <div>
      <header>
        <ul className="w-full min-h-full flex justify-center bg-blue-300 space-x-4">
          <li className="py-2 px-4 cursor-pointer bg-green-400 rounded-lg transition-all hover:scale-105 hover:ring-1 hover:ring-gray-950 duration-300">
            ថ្នាក់ទី១
          </li>
          <li className="py-2 px-4 cursor-pointer bg-green-400 rounded-lg transition-all hover:scale-105 hover:ring-1 hover:ring-gray-950 duration-300">
            ថ្នាក់ទី២
          </li>
          <li className="py-2 px-4 cursor-pointer bg-green-400 rounded-lg transition-all hover:scale-105 hover:ring-1 hover:ring-gray-950 duration-300">
            ថ្នាក់ទី៣
          </li>
          <li className="py-2 px-4 cursor-pointer bg-green-400 rounded-lg transition-all hover:scale-105 hover:ring-1 hover:ring-gray-950 duration-300">
            ថ្នាក់ទី៤
          </li>
          <li className="py-2 px-4 cursor-pointer bg-green-400 rounded-lg transition-all hover:scale-105 hover:ring-1 hover:ring-gray-950 duration-300">
            ថ្នាក់ទី៥
          </li>
          <li className="py-2 px-4 cursor-pointer bg-green-400 rounded-lg transition-all hover:scale-105 hover:ring-1 hover:ring-gray-950 duration-300">
            ថ្នាក់ទី៦
          </li>
        </ul>
      </header>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-[1.5rem] text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                ឈ្មោះសិស្ស
              </th>
              <th scope="col" className="px-6 py-3">
                ភេទ
              </th>
              <th scope="col" className="px-6 py-3">
                ថ្ងៃខែឆ្នាំកំណើត
              </th>
              <th scope="col" className="px-6 py-3">
                មកពីថ្នាក់ទី
              </th>
              <th scope="col" className="px-6 py-3">
                ផ្សេងៗ
              </th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? (
              students.map((student, index) => (
                <tr
                  key={student.studentId}
                  className={`border-b dark:border-gray-700 ${
                    index % 2 === 0
                      ? "bg-white dark:bg-gray-900"
                      : "bg-gray-50 dark:bg-gray-800"
                  }`}                >
                  <td className="px-6 py-4">
                    {student.FirstName} {student.LastName}
                  </td>
                  <td className="px-6 py-4">{student.gender}</td>
                  <td className="px-6 py-4 text-xl">{new Date(student.dateOfBirth).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-xl ">{student.grade || "N/A"}</td>
                  <td className="px-6 py-4"></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10} style={{ textAlign: "center" }}>
                  No students found
                </td>
              </tr>
            )}
       
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Student;
