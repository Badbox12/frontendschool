"use client";
import ClientLayout from "./layout";

import Image from "next/image";
import { FaEye } from "react-icons/fa";
import { useState } from "react";
import PasswordField from "../components/password-field";
import Footer from "../components/Footer";
export default function Home() {
  const image =
    "https://firebasestorage.googleapis.com/v0/b/uploadingfile-9e2b5.appspot.com/o/image%2F2024-11-18%2008.36.57.jpg?alt=media&token=54a5d604-1ac3-48f9-8755-08a03b5eb389";
  const [showPass, setShowPass] = useState<boolean>(false);
  const handleShowpass = () => {
    setShowPass(!showPass);
  };
  return (
    // <ClientLayout>
    <main className=" max-w-full flex flex-wrap  h-[100vh] scroll-smooth ">
      <div className="w-[90%] flex   md:flex-row flex-col mx-auto gap-3 mt-10 px-2 justify-center">
        {/* Card */}
        <div className="bg-gray-100 w-full md:w-[60%] h-[500px] focus:outline-none rounded-lg hover:ring-1 hover:ring-blue-600 hover:bg-gray-100 duration-300 transition-transform hover:scale-105">
          <div className="md:text-3xl text-lg  flex flex-col items-center justify-center space-y-2 mt-36">
            <h1>ចតុស្តម្ភ​ទាំង ៤​ នៃ​វិស័យ​អប់រំ ៖</h1>
            <ul className="space-y-2">
              <li>១.ចំណេះដឹង</li>
              <li>២.ចំណេះធើ្វ</li>
              <li>៣. សីលធម៌ល្អ</li>
              <li>៤. ​ចេះរួម​រស់​ជា​មួយគ្នា ប្រកប​ដោយ​សុខ​ដុម​រមនា</li>
            </ul>
          </div>
        </div>
        {/* Card */}
        <div className=" bg-gray-100 w-full md:w-[40%] h-[500px] rounded-lg hover:ring-1 hover:ring-blue-600 hover:bg-gray-100 duration-500 transition-all hover:scale-105">
          {/* Form */}
          <form className="flex flex-col items-center space-y-2">
            <div className="md:text-3xl text-lg my-5">
              <h2>ចុះឈ្មោះបាន ភ្លាមៗ</h2>
            </div>
            <div>
              <label
                htmlFor="username"
                className="block mb-2 font-medium text-gray-900"
              >
                ឈ្មោះរបស់អ្នក
              </label>
              <input
                type="text"
                id="username"
                placeholder="នាមត្រកូល នាមខ្លួន"
                className="bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 text-sm w-full block p-2.5 rounded-lg"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                អ៊ីម៉ែលរបស់អ្នក
              </label>
              <input
                type="email"
                id="email"
                placeholder="name@gmail.com"
                className="bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 text-sm w-full block p-2.5 rounded-lg"
              />
            </div>
            <div>
              <label
                htmlFor=""
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                ពាក្យសម្ងាត់
              </label>
              <PasswordField placeholder="enter your password" />
            </div>
            <div>
              <label
                htmlFor="repassword"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                បញ្ជាក់ពាក្យសម្ងាត់
              </label>
              <PasswordField placeholder="enter your re-password" />
            </div>
          </form>
          {/* Form */}
        </div>
      </div>
      <div className="w-[90%] flex   md:flex-row flex-col mx-auto gap-3 mt-10 px-2 justify-center">
        <Footer />
      </div>
    </main>
   // </ClientLayout>
  );
}
