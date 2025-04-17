"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
const PasswordField = ({placeholder}: any) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const toggleVisibility = () => setIsVisible((prevState) => !prevState);
  return (
    <div className="relative">
      <input
        id="password"
        type={isVisible ? "text" : "password"}
        className="bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 text-sm w-full block p-2.5 rounded-lg"
        placeholder={placeholder}
        aria-label="Password"
        required
      />
      <button
        className="absolute inset-y-0 end-0 flex items-center  px-2.5 cursor-pointer text-gray-400 rounded-e-md focus:outline-none focus-visible:text-indigo-500 hover:text-indigo-500 transition-colors"
        type="button"
        onClick={toggleVisibility}
        aria-label={isVisible ? "Hide password" : "Show password"}
        aria-pressed={isVisible}
        aria-controls="password"
      >
        {isVisible ? (
          <EyeOff size={20} aria-hidden="true" />
        ) : (
          <Eye size={20} aria-hidden="true" />
        )}
      </button>
    </div>
  );
};

export default PasswordField;
