'use client';
import Link from "next/link";
import { Provider } from "react-redux";
import { store } from "@/app/store/store";
import {  useAppSelector } from "@/app/hook/hooks";
interface SuperAdminLayoutProps {
    children: React.ReactNode;
  }
const SuperAdminLayout = ({ children } : SuperAdminLayoutProps) => {
    const user = useAppSelector((state)=> state.auth.user);
    console.log("SuperAdminLayout: user =", user);
  return (
    <Provider store={store}>
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <nav className="bg-blue-500 py-4 text-white">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold">Super Admin Dashboard</h1>
          <div>
            <Link
              href="/super-admin/admins"
              className="px-4 py-2 hover:bg-blue-600 rounded"
            >
              Manage Admins
            </Link>
            <Link
              href="/super-admin/students"
              className="px-4 py-2 ml-4 hover:bg-blue-600 rounded"
            >
              Manage Students
            </Link>
          </div>
        </div>
      </nav>
      <main className="p-8 max-w-6xl mx-auto">
        {children}
      </main>
    </div>
    </Provider>
  );
};

export default SuperAdminLayout;
