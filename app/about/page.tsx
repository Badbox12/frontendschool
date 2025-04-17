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
const About = async () => {
  const students = await fetchStudents();
 
  return (
    <div>
      <h1>Student List</h1>
      <ul>
        {students.length > 0 ? (
          students.map((student) => (
            <li key={student.studentId}>
              {student.FirstName} {student.LastName} (
              {student.grade || "No grade"})
            </li>
          ))
        ) : (
          <li>No students found</li>
        )}
      </ul>
    </div>
  );
};

export default About;
