'use client';
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Provider } from "react-redux";
import { store, persistor } from "@/app/store/store";
import {  useAppSelector } from "@/app/hook/hooks";
import { PersistGate } from "redux-persist/integration/react";
interface SuperAdminLayoutProps {
    children: React.ReactNode;
  }function ProtectedSuperAdminLayout({ children }: SuperAdminLayoutProps) {
    const user = useAppSelector((state) => state.auth.user);
    console.log("ProtectedSuperAdminLayout: user =", user);
    const loading = useAppSelector((state) => state.auth.loading);
    const router = useRouter();
  
    useEffect(() => {
      if (!loading) {
        if (!user || user.role !== "superadmin") {
          router.replace("/super-admin/login");
        }
      }
    }, [user, loading, router]);
  
    // Optionally show a loading spinner while checking session
    if (loading || !user) {
      return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }
  
    return <>{children}</>;
  }

const SuperAdminLayout = ({ children } : SuperAdminLayoutProps) => {
  return (
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ProtectedSuperAdminLayout>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
          <nav className="bg-blue-700 py-4 text-white">
            <div className="flex justify-between items-center max-w-6xl mx-auto">
              <h1 className="text-2xl font-bold">Super Admin Dashboard</h1>
              <div>
                {/* Add more nav links as needed */}
              </div>
            </div>
          </nav>
          <main className="p-8 max-w-6xl mx-auto">{children}</main>
        </div>
      </ProtectedSuperAdminLayout>
    </PersistGate>
  </Provider>
  );
};

export default SuperAdminLayout;
