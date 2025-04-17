'use client'

import { useState, FormEvent, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPasswordAction } from "@/app/actions/auth/resetPassword"; // Adjust the import path as needed
import { toast } from "react-toastify";
import { FiLock, FiLoader, FiEye, FiEyeOff } from "react-icons/fi";
export default function ResetPasswordPage() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');
    useEffect(() => {
      if (!token) {
        toast.error('Invalid or expired password reset link');
        router.push("/admin/login");
    }
      }, [token, router]);
    
      const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
          toast.error('Passwords do not match.');
          return;
        }
        setLoading(true);
        if (!token) {
          toast.error('Reset token not found. Please restart the process.');
          setLoading(false);
          return;
        }
    
        try {
          const response = await fetch('/api/admin/resetpassword', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token, newPassword }),
          });
    
          const data = await response.json();
    
          if (response.ok) {
            toast.success(data.message || 'Password reset successfully!');
            router.push('/admin/login');
          } else {
            toast.error(data.error || 'Failed to reset password');
          }
        } catch (error) {
          console.error('Reset password error:', error);
          toast.error('An unexpected error occurred.');
        } finally {
          setLoading(false);
        }
      };

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-md">
              <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                      Reset Password
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                      Enter your new password below
                  </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                      {/* New Password Field */}
                      <div className="relative">
                          <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                          <input
                              type={showPassword ? "text" : "password"}
                              required
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder="New Password"
                              className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all"
                              minLength={8}
                          />
                          <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
                              aria-label={showPassword ? "Hide password" : "Show password"}
                          >
                              {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                          </button>
                      </div>

                      {/* Confirm Password Field */}
                      <div className="relative">
                          <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                          <input
                              type={showPassword ? "text" : "password"}
                              required
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              placeholder="Confirm New Password"
                              className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all"
                              minLength={8}
                          />
                      </div>
                  </div>

                  <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                      {loading ? (
                          <>
                              <FiLoader className="animate-spin" />
                              Resetting Password...
                          </>
                      ) : (
                          "Reset Password"
                      )}
                  </button>
              </form>

              <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                  Remember your password?{" "}
                  <button
                      onClick={() => router.push("/admin/login")}
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                      Login here
                  </button>
              </div>
          </div>
      </div>
  )
}