import { notFound } from "next/navigation";
import Link from "next/link";
interface Log {
  _id: string;
  action: string;
  details?: string;
  createdAt: string;
  adminId: {
    _id: string;
    username: string;
    email: string;
  };
}

export default async function AdminLogsPage({ params }: { params: { adminId: string } }) {
  const { adminId } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const res = await fetch(`${baseUrl}/admin/${adminId}/logs`, { cache: "no-store" });
  const data = await res.json();

  return (
    <div className="relative max-w-4xl mx-auto mt-10 p-8 rounded-2xl overflow-hidden border border-indigo-400/30 shadow-2xl shadow-indigo-400/70">
      {/* Animated RGB Background */}
      <div
        className="absolute inset-0 animate-rgb-glow"
        aria-hidden="true"
      />
      <div className="relative z-10 bg-gradient-to-br from-slate-900/70 to-indigo-900/70 rounded-2xl p-2">
      <div className="mb-6">
          <Link
            href="/super-admin/admins"
            className="inline-block px-5 py-2 rounded-full bg-indigo-500 hover:bg-indigo-400 text-white font-semibold shadow-md transition-all duration-200 drop-shadow-glow"
          >
            ← Back to Super Admin Dashboard
          </Link>
        </div>
        <h1 className="text-3xl font-extrabold text-white mb-8 text-center drop-shadow-glow">
          Admin Logs for <span className="text-indigo-400">{adminId}</span>
        </h1>
        <div className="overflow-x-auto">
          <table className="min-w-full shadow-xl rounded-xl overflow-hidden border border-indigo-500/40 bg-slate-800/80">
            <thead>
              <tr className="bg-indigo-900/70">
                <th className="py-3 px-4 text-left text-indigo-300 font-semibold text-sm tracking-widest uppercase">Date</th>
                <th className="py-3 px-4 text-left text-indigo-300 font-semibold text-sm tracking-widest uppercase">Action</th>
                <th className="py-3 px-4 text-left text-indigo-300 font-semibold text-sm tracking-widest uppercase">Details</th>
              </tr>
            </thead>
            <tbody>
              {data.logs && data.logs.length > 0 ? (
                data.logs.map((log: Log) => (
                  <tr key={log._id} className="hover:bg-indigo-800/80 transition-colors">
                    <td className="py-2 px-4 text-slate-100 font-mono drop-shadow-glow">{new Date(log.createdAt).toLocaleString()}</td>
                    <td className="py-2 px-4 text-indigo-300 font-semibold drop-shadow-glow">{log.action}</td>
                    <td className="py-2 px-4 text-slate-200 drop-shadow-glow">{log.details}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-4 px-4 text-center text-slate-400 drop-shadow-glow">No logs found for this admin.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}