"use client";
import { useState, FormEvent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "@/app/features/authSlice";
import { useRouter } from "next/navigation";
import type { RootState, AppDispatch } from "@/app/store/store";
import { toast } from "react-toastify";

const SuperAdminLoginPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { loading, error, user, super_token } = useSelector(
    (state: RootState) => state.auth
  );
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
    // Check for cookie and navigate if already set
    useEffect(() => {  
      console.log("Super Admin Login is running", super_token);
        if (super_token && user?.role === "superadmin") {
          router.push("/super-admin/admins");
        }
    }, [user, router]);
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const result = await dispatch(loginUser({ email, password })).unwrap();
      if (result.user?.role === "superadmin") {
        // Check if super_token cookie was set by the API
        setTimeout(() => {
          const hasSuperToken = document.cookie.split("; ")
            .some(c => c.startsWith("has_super_token="));
            console.log("Super Token Cookie:", hasSuperToken);
          if (hasSuperToken) {
            toast.success("Welcome, Super Admin!");
            router.push("/super-admin/admins");
          } else {
            toast.error("Authentication error: Super token not set.");
          }
        }, 300); // Small delay to ensure cookie is set
      } else {
        toast.error("You are not a superadmin.");
      }
    } catch (err: any) {
      toast.error(err.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="mb-4 text-2xl font-bold">Super Admin Login</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-2 p-2 border rounded"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 border rounded"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          disabled={loading}
        />
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <button
          type="submit"
          className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default SuperAdminLoginPage;