import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4001";

// Promote Admin
export const promoteAdminApi = async (id: string) => {
  const res = await axios.patch(`${API_BASE}/admin/${id}/promote`, {}, { withCredentials: true });
  return res.data;
};

// Demote Admin
export const demoteAdminApi = async (id: string) => {
  const res = await axios.patch(`${API_BASE}/admin/${id}/demote`, {}, { withCredentials: true });
  return res.data;
};

// Suspend Admin
export const suspendAdminApi = async (id: string) => {
  const res = await axios.patch(`${API_BASE}/admin/${id}/suspend`, {}, { withCredentials: true });
  return res.data;
};