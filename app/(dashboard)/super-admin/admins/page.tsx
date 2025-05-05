'use client';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hook/hooks';
import {
  fetchAdmins, deleteAdmin, promoteAdmin, demoteAdmin, suspendAdmin, resetAdminPassword
} from '@/app/features/adminSlice';
import Link from 'next/link';

// You can use a UI library (e.g. Tailwind, Material UI, Chakra UI).
// This example uses Tailwind CSS for modern, clean styles.

export default function AdminsListPage() {
  const dispatch = useAppDispatch();
  const { admins, loading, error } = useAppSelector((state) => state.admin);

  useEffect(() => { dispatch(fetchAdmins()); }, [dispatch]);
// Logout handler (replace with your real logout logic)
const handleLogout = () => {
  document.cookie = "super_token=; Max-Age=0; path=/";
  window.location.href = '/super-admin/login';
};
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen bg-gray-50">
        {/* Logout Button - fixed bottom left */}
        <button
        onClick={handleLogout}
        className="fixed bottom-8 left-8 z-50 flex items-center gap-2 px-5 py-2 rounded-full bg-red-600 text-white font-bold shadow-lg hover:bg-red-700 transition-all duration-200"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
        </svg>
        Logout
      </button>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Admin Management</h1>
        <Link
          href="/super-admin/admins/create"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition"
        >
          <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Admin
        </Link>
      </div>
      {loading && (
        <div className="flex justify-center items-center py-10">
          <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></span>
          <span className="ml-3 text-gray-500">Loading admins...</span>
        </div>
      )}
      {error && (
        <div className="mb-4 text-red-600 font-medium bg-red-50 px-4 py-2 rounded">{error}</div>
      )}
      <div className="overflow-x-auto rounded shadow bg-white">
        <table className="min-w-full divide-y divide-gray-200 table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Username</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Last Login</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-900">
            {admins.map((admin) => (
              <tr key={admin._id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-3">{admin.email}</td>
                <td className="px-6 py-3">{admin.username}</td>
                <td className="px-6 py-3">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium 
                    ${admin.role === 'superadmin' ? 'bg-green-100 text-green-800' : 
                      admin.role === 'admin' ? 'bg-blue-100 text-blue-800' : 
                      'bg-yellow-100 text-yellow-800'}
                  `}>
                    {admin.role.charAt(0).toUpperCase() + admin.role.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-3">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium
                    ${admin.status === 'active' ? 'bg-green-50 text-green-700' : 
                      admin.status === 'pending' ? 'bg-yellow-50 text-yellow-700' :
                      admin.status === 'rejected' ? 'bg-gray-200 text-gray-600' :
                      admin.status === 'suspended' ? 'bg-red-50 text-red-700' : ''}
                  `}>
                    {admin.status.charAt(0).toUpperCase() + admin.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-3">
                  {admin.lastLogin ? (
                    <span className="text-sm text-gray-700">
                      {new Date(admin.lastLogin).toLocaleString()}
                    </span>
                  ) : (
                    <span className="italic text-gray-400 text-xs">Never</span>
                  )}
                </td>
                <td className="px-6 py-3 space-x-1 flex flex-wrap">
                  <Link
                    href={`/super-admin/admins/${admin._id}/edit`}
                    className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 text-xs font-medium"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => dispatch(deleteAdmin(admin._id))}
                    className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 text-xs font-medium"
                  >
                    Delete
                  </button>
                  {admin.role !== 'superadmin' && (
                    <button
                      onClick={() => dispatch(promoteAdmin(admin._id))}
                      className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200 text-xs font-medium"
                    >
                      Promote
                    </button>
                  )}
                  {admin.role === 'superadmin' && (
                    <button
                      onClick={() => dispatch(demoteAdmin(admin._id))}
                      className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 text-xs font-medium"
                    >
                      Demote
                    </button>
                  )}
                  {admin.status !== 'suspended' ? (
                    <button
                      onClick={() => dispatch(suspendAdmin(admin._id))}
                      className="inline-flex items-center px-2 py-1 bg-red-50 text-red-700 rounded hover:bg-red-100 text-xs font-medium"
                    >
                      Suspend
                    </button>
                  ) : (
                    <span className="inline-block px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs font-medium">Suspended</span>
                  )}
                  <button
                    onClick={() => {
                      const pwd = prompt("Enter new password:");
                      if (pwd) dispatch(resetAdminPassword({ id: admin._id, newPassword: pwd }));
                    }}
                    className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 text-xs font-medium"
                  >
                    Reset PW
                  </button>
                  <Link
                    href={`/super-admin/admins/${admin._id}/logs`}
                    className="inline-flex items-center px-2 py-1 bg-gray-50 text-gray-700 rounded hover:bg-gray-100 text-xs font-medium"
                  >
                    Logs
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
          {admins.length === 0 && !loading && (
            <tfoot>
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">
                  No admins found.
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}