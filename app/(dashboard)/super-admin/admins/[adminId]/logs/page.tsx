'use client';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hook/hooks';
import { fetchAdminLogs } from '@/app/features/adminSlice';
import { useParams } from 'next/navigation';

export default function AdminLogsPage() {
  // Only call useParams once:
  const params = useParams();
  // Ensure adminId is a string:
  const adminId = Array.isArray(params.adminId) ? params.adminId[0] : params.adminId;

  const logs = useAppSelector((state) =>
    adminId ? state.admin.logs[adminId] || [] : []
  );
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.admin.loading);

  useEffect(() => {
    if (adminId) dispatch(fetchAdminLogs(adminId));
  }, [adminId, dispatch]);

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h2 className="text-xl font-bold mb-4">Admin Activity Logs</h2>
      {loading && <p>Loading...</p>}
      <ul className="bg-white rounded shadow p-4">
        {logs.length === 0 && !loading && (
          <li className="py-2 text-gray-500 italic">No logs found.</li>
        )}
        {logs.map((log) => (
          <li key={log._id} className="border-b py-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold">{log.action}</span>
              <span className="text-xs text-gray-500">{new Date(log.timestamp).toLocaleString()}</span>
            </div>
            {log.details && (
              <div className="text-xs text-gray-600">{log.details}</div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}