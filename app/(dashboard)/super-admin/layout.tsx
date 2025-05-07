'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Provider } from "react-redux";
import { store, persistor } from "@/app/store/store";
import { useAppSelector } from "@/app/hook/hooks";
import { PersistGate } from "redux-persist/integration/react";
import SuperAdminNavbar from '@/app/components/SuperAdminNavBar';
import { ToastContainer } from "react-toastify";
interface SuperAdminLayoutProps {
  children: React.ReactNode;
}

function ProtectedSuperAdminLayout({ children }: SuperAdminLayoutProps) {
  console.log("ProtectedSuperAdminLayout rendering");
  const { super_token } = useAppSelector((state) => state.auth);
 
  const router = useRouter();
  
  
  
  // Perform initial checks
  useEffect(() => {
    if (!super_token) {
      // Redirect to login if not authenticated
      router.push("/super-admin/login");
    }
      
   
  }, [super_token, router]);
  
  return (
    <div className="min-h-screen bg-gray-100">
      <SuperAdminNavbar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

const SuperAdminLayout = ({ children }: SuperAdminLayoutProps) => {
  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading Redux store...</div>} persistor={persistor}>
        <ProtectedSuperAdminLayout>
          <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <nav className="bg-blue-700 py-4 text-white">
              <div className="flex justify-between items-center max-w-6xl mx-auto">
                {/* <h1 className="text-2xl font-bold">Super Admin Dashboard</h1> */}
               
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