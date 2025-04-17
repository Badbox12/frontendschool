'use client';
import React, {useEffect} from "react";
import { useAppSelector, useAppDispatch } from "@/app/hook/hooks";
import { canModify } from "@/app/utils/permissions";
import { fetchAdmins, deleteAdminAction } from "@/app/features/adminSlice";
import { useRouter } from "next/navigation";
export default function AdminList() {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const { role, admins, loading, error } = useAppSelector((state) => state.admin);
  const hasEditPermission = canModify(role || '');
 useEffect(() => {
  dispatch(fetchAdmins())
 },[dispatch])
  // Handler for deleting an admin
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this admin?')) {
      dispatch(deleteAdminAction(id));
    }
  };
    // Handler for editing an admin (navigate to an edit page)
    const handleEdit = (id: string) => {
      router.push(`/admin/edit/${id}`);
    };
  return(
<div className="overflow-x-auto">
      {loading && <p className="p-4">Loading admins...</p>}
      {error && <p className="p-4 text-red-500">{error}</p>}
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-300">
          <tr>
            <th scope="col" className="px-6 py-3">
              Email
            </th>
            <th scope="col" className="px-6 py-3">
              Username
            </th>
            <th scope="col" className="px-6 py-3">
              Role
            </th>
            <th scope="col" className="px-6 py-3">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <tr
              key={admin._id}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
            >
              <td className="px-6 py-4">{admin.email}</td>
              <td className="px-6 py-4">{admin.username}</td>
              <td className="px-6 py-4">{admin.role}</td>
              <td className="px-6 py-4">
                <button
                  onClick={() => handleEdit(admin._id)}
                  disabled={!hasEditPermission}
                  className={`px-4 py-2 rounded ${
                    hasEditPermission
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-gray-300 text-gray-700 cursor-not-allowed'
                  }`}
                >
                  Edit
                </button>{' '}
                |{' '}
                <button
                  onClick={() => handleDelete(admin._id)}
                  disabled={!hasEditPermission}
                  className={`px-4 py-2 rounded ${
                    hasEditPermission
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-gray-300 text-gray-700 cursor-not-allowed'
                  }`}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
