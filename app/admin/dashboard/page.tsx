"use client";
import StudentList from "../components/studentList";
import AdminList from "../components/adminList";
import { FaBars, FaTimes } from "react-icons/fa";
import { use, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { logout, clearRegistrationMessage } from "../../features/authSlice";
import type { AppDispatch } from "@/app/store/store";

import { useAppSelector } from "@/app/hook/hooks";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner";
import StudentMarkList from "../components/studentMarkList";
export default function DashboardAdmin() {
  const [view, setView] = useState<"students" | "admins" | "marks">("students"); // State to toggle view
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  
  const {loading:authLoading} = useAppSelector((state) => state.auth);
  // Authorization check
  const displayRole = user?.role ?? "Unknown Role";
  const displayUsername = user?.username ?? "Guest";
  useEffect(() => {
    if (!authLoading) {
      if (!user?.role || user?.role !== "admin") {
        console.log("Unauthorized, redirecting to login");
        router.push("/admin/login");
      } else {
        console.log("Authorized, setting isLoading to false");
        setIsLoading(false);
      }
    }
  }, [user?.role, authLoading, router]);
  const handleLogout = async () => {
    try {
      // Call the logout API route
      const res = await fetch("/api/admin/logout", { method: "POST" });
      if (res.ok) {
        // Optionally clear Redux auth state
        dispatch(logout());
        dispatch(clearRegistrationMessage());
        // Redirect to the login page
        router.push("/admin/login");
        toast.success("Logged out successfully");
      } else {
        const error = await res.json();
        toast.error(error.message || "Logout failed");
        console.error("Failed to logout");
      }
    } catch (error) {
      toast.error("Network error during logout");
      console.error("Logout error:", error);
    }
  };
  const SidebarButton = ({
    targetView,
    label,
  }: {
    targetView: "students" | "admins" | "marks";
    label: string;
  }) => (
    <button
      onClick={() => {
        setView(targetView);
        setIsSidebarOpen(false);
      }}
      className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
        view === targetView
          ? "bg-blue-500 text-white"
          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
      }`}
      aria-label={`View ${label}`}
    >
      {label}
    </button>
  );
 
  if (authLoading) {
    return <LoadingSpinner fullScreen />;
  }
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/*Mobile Button */}
      <button
      aria-label="Toggle Sidebar"
        className="md:hidden fixed top-4 left-4 z-50 p-3 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300  dark:hover:bg-gray-600 transition-colors"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <FaBars className="w-6 h-6 text-gray-800 dark:text-white" />
      </button>

      {/* Sidebar Overlay (Mobile Only) */}
      {isSidebarOpen && (
        <div 
        className="fixed inset-0 bg-black/50 md:hidden z-40"
        onClick={() => setIsSidebarOpen(false)}
        role="button"
        tabIndex={0}
        aria-label="Close sidebar"
        onKeyDown={(e) => e.key === "Enter" && setIsSidebarOpen(false)}
      />
      )}
      {/* Sidebar */}
      <aside
        className={`fixed md:relative inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } `}
        aria-label="Admin navigation sidebar"
      >
        <div className="h-full flex flex-col p-4 ">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Admin Panel
            </h2>
            <button
              aria-label="Close Sidebar"
              className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
              onClick={() => setIsSidebarOpen(false)}
            >
              <FaTimes className="w-6 h-6" />
            </button>
          </div>
          <nav className="flex-1 space-y-2">
          <SidebarButton targetView="students" label="Students" />
            <SidebarButton targetView="admins" label="Admins" />
            <SidebarButton targetView="marks" label="Marks" />
          </nav>
          {/* Logout Button at the Bottom */}
          <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="mb-4">
              <p className="text-sm font-medium text-gray-white dark:text-gray-300">
                {displayUsername}
              </p>
              <p className="text-xs text-gray-white dark:text-gray-400">
                {displayRole}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 rounded-lg transition-colors bg-red-500 text-white hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        <div className="p-6 md:p-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              {`${view.charAt(0).toUpperCase() + view.slice(1)} Management`}
            </h1>
          </header>

          {view === "students" && <StudentList />}
          {view === "admins" && <AdminList />}
          {view === "marks" && <StudentMarkList />}
        </div>
      </main>
    </div>
  );
}
