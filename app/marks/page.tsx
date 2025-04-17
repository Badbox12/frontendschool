"use client";
import { useRouter } from "next/navigation";

export default function MarksIndex() {
  const router = useRouter();

  const students = [
    { _id: "63abc", name: "Alice" },
    { _id: "63def", name: "Bob" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">All Students</h1>
      <ul>
        {students.map((stu) => (
          <li key={stu._id} className="my-2 flex items-center gap-2">
            <span>{stu.name}</span>
            <button
              onClick={() => router.push(`/marks/student/${stu._id}?modal=1`)}
              className="px-3 py-1 bg-blue-500 text-white rounded"
            >
              View Marks (Modal)
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
