"use client";
import { Provider } from "react-redux";
import { useRouter } from "next/navigation";
import  { store, persistor } from "@/app/store/store"
import { useAppSelector } from "../hook/hooks";
import {  useEffect,  } from "react";
// import { setCredentials } from "../store/authSlice";
import { PersistGate } from "redux-persist/integration/react";
interface AdminLayoutProps {
  children: React.ReactNode;
}
function ProtectedAdminLayout({ children }: AdminLayoutProps) {
  // You can use your Redux hooks here safely because this layout is wrapped in Provider.

  const {token} = useAppSelector((state) => state.auth)
  const router = useRouter();
// On mount, check if Redux doesn't have a token but localStorage does.

  useEffect(() => {
    
    if (!token) {
      // Redirect to login if not authenticated
      router.push("/admin/login");
    }
  }, [token, router]);

  return <>{children}</>;
}
export default function AdminLayout({children} : AdminLayoutProps) {
  //console.log(window.location.href)

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      <ProtectedAdminLayout>
        {children}
        </ProtectedAdminLayout>
        </PersistGate>
    </Provider>
  );
}
