"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function ConfirmPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing token. Please check your confirmation link.");
      setLoading(false);
      return;
    }
    
    async function confirmAdmin() {
      try {
        const res = await fetch(`/api/admin/confirm?token=${token}`);
        const data = await res.json();
        if (data.success) {
          setMessage("Admin account approved successfully.");
          // Redirect after 2 seconds (adjust delay as needed)
          setTimeout(() => {
            router.push("/admin/login");
          }, 2000);
        } else {
          setError(data.error || "Failed to approve admin account.");
        }
      } catch (err: any) {
        setError(err.message || "An error occurred during confirmation.");
      } finally {
        setLoading(false);
      }
    }

    confirmAdmin();
  }, [token, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
      {loading ? (
        <p className="text-xl text-gray-700 dark:text-gray-300">Processing confirmation...</p>
      ) : error ? (
        <p className="text-xl text-red-500">{error}</p>
      ) : (
        <p className="text-xl text-green-500">{message}</p>
      )}
    </div>
  );
}
