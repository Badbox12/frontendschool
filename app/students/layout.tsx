import React from "react";
import Navbar from "../components/Navbar";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
      <div>
         <Navbar />
        {/* <header className="bg-blue-600 text-white p-4">Client Portal</header> */}
        <main>{children}</main>
      </div>
    );
  }
  