// app/components/SuperAdminNavbar.tsx
"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '@/app/features/authSlice';
import type { AppDispatch, RootState } from '@/app/store/store';
import { toast } from 'react-toastify';

export default function SuperAdminNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useSelector((state: RootState) => state.auth);
  const [currentTime, setCurrentTime] = useState('');

  // Update time every minute
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formattedTime = now.toISOString().replace('T', ' ').substring(0, 19);
      setCurrentTime(formattedTime);
    };
    
    updateTime(); // Initial update
    const interval = setInterval(updateTime, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      toast.success('Logged out successfully');
      router.push('/super-admin/login');
    } catch (error) {
      toast.error('Failed to logout. Please try again.');
    }
  };

  // Navigation items for superadmin
  const navItems = [
    { name: 'Dashboard', href: '/super-admin/dashboard' },
    { name: 'Admins', href: '/super-admin/admins' },
    { name: 'Teachers', href: '/super-admin/teachers' },
    { name: 'Students', href: '/super-admin/students' },
    { name: 'Settings', href: '/super-admin/settings' },
  ];

  // Check if the current user is a superadmin
  const isSuperAdmin = user?.role === 'superadmin';

  if (!isSuperAdmin && !loading) {
    return null; // Don't render navbar for non-superadmins
  }

  return (
    <nav className="bg-blue-800 text-white">
      {/* Main navbar container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and primary navigation */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              {/* Logo or brand name */}
              <Link href="/super-admin/dashboard" className="text-xl font-bold">
                School Admin
              </Link>
            </div>
            
            {/* Desktop navigation links */}
            <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
              {navItems.map((item) => (
                <Link 
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === item.href
                      ? 'bg-blue-900 text-white'
                      : 'hover:bg-blue-700 hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Right side - user info, time, logout */}
          <div className="hidden md:flex items-center">
            {/* Current time display */}
            <div className="text-sm mr-4 text-gray-300">
              {currentTime}
            </div>
            
            {/* User info */}
            {user && (
              <div className="flex items-center">
                <span className="text-sm font-medium mr-4">
                  {user.username} <span className="text-blue-300">({user.role})</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md text-sm font-medium bg-red-600 hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-blue-200 hover:text-white hover:bg-blue-700 focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon for menu button - open/closed states */}
              {isMobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu, show/hide based on state */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === item.href
                    ? 'bg-blue-900 text-white'
                    : 'hover:bg-blue-700 hover:text-white'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Mobile view: Current time */}
            <div className="px-3 py-2 text-sm text-gray-300">
              {currentTime}
            </div>
            
            {/* Mobile view: User info and logout */}
            {user && (
              <>
                <div className="px-3 py-2 text-sm font-medium">
                  {user.username} <span className="text-blue-300">({user.role})</span>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium bg-red-600 hover:bg-red-700"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}