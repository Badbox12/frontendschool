// OtpVerification.tsx
"use client";
import React, { useEffect, useRef, useState } from "react";
import { FiArrowLeft, FiLoader, FiRefreshCw } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { verifyOTPAction } from "@/app/actions/auth/verifyOtp";
import { forgotPasswordAction } from "@/app/actions/auth/forgotPassword";
const OtpVerification: React.FC = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(120);
  const router = useRouter();
  const email = sessionStorage.getItem("forgotPasswordEmail");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  useEffect(() => {
    inputRefs.current[0]?.focus();
    startCountdown()
  }, []);
  const startCountdown = () => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  };
  const handleInputChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow numbers
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

     // Auto submit when all fields are filled
     if(newOtp.every(d => d) && newOtp.length === 6) {
      handleSubmit();
     }
  };
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  const handleResendOtp = async () =>{
    if (!email || countdown > 0) return;
    try {
      setResendLoading(true);
      const result = await forgotPasswordAction(email);
      if(result.success){
        toast.success("OTP sent successfully!");
        setCountdown(120);
        startCountdown();
      }else{
        toast.error("Failed to send OTP. Please try again.");
      }
    } catch ( error : any) {
      toast.error("Failed to send OTP. Please try again.");
      
    }finally{
      setResendLoading(false);
    }
  }
  const handleSubmit = async () => {
   
    if (!email) {
      toast.error("Email not found. Please restart the process.");
      router.push("/admin/forgotpassword");
      setLoading(false);
      return;
    }
    if(otp.some(d => !d)){
      setMessage("Please fill all fields.");
      return;

    }
    setLoading(true);

    try {
     
      const otpString = otp.join('');
      const result = await verifyOTPAction(email, otpString);
      
     
      if (result.success && result.data?.token) {
       // Pass token via URL instead of sessionStorage
       router.push(`/admin/resetpassword?token=${encodeURIComponent(result.data.token)}`);
        toast.success("OTP verified successfully!");
      }
    } catch (error) {
      toast.error("Verification failed. Please try again.");
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-md">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 mb-6"
        >
          <FiArrowLeft className="mr-2" />
          Back
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Verify OTP
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            We've sent a 6-digit code to {email}
          </p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <div className="flex justify-center gap-2 mb-8">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                ref={(el) => {(inputRefs.current[index] = el)}}
                className="w-12 h-12 text-center text-xl border-2 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                disabled={loading}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <FiLoader className="animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify OTP"
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          {countdown > 0 ? (
            `Resend OTP in ${countdown}s`
          ) : (
            <button
              onClick={handleResendOtp}
              disabled={resendLoading}
              className="text-blue-600 dark:text-blue-400 hover:underline flex items-center justify-center gap-1"
            >
              {resendLoading ? (
                <>
                  <FiLoader className="animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <FiRefreshCw className="mr-1" />
                  Resend OTP
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;
