import { LogEntry } from "@/types/admin";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
//import { promoteAdminApi, demoteAdminApi, suspendAdminApi } from "@/app/api/adminApi";
import nookies from "nookies";
// Define the type for an admin
export interface Admin {
  _id: string;
  username: string;
  email: string;
  role: string;
  // add other fields as needed
  status: string;
  lastLogin: string;
}

interface AdminState {
  admins: Admin[];
  currentAdmin?: Admin;
  loading: boolean;
  error?: string;
  role?: string;
  logs: Record<string, LogEntry[]>; // <--- logs: { [adminId]: LogEntry[] }
}

const initialState: AdminState = {
  admins: [],
  loading: false,
  error: undefined,
  logs: {}, // <--- logs: { [adminId]: LogEntry[] }
};
export const deleteAdmin = createAsyncThunk(
  "admin/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await axios.post("/api/admin/deleteAdmin", { id });
      if (!res.data.success)
        throw new Error(res.data.error || "Failed to delete admin");
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
// Promote admin
export const promoteAdmin = createAsyncThunk<string, string>(
  "admin/promote",
  async (id: string) => {
    const res = await axios.post("/api/admin/promote", { id });
    if (!res.data.success)
      throw new Error(res.data.error || "Failed to promote");
    return id;
  }
);

// Demote admin
export const demoteAdmin = createAsyncThunk<string, string>(
  "admin/demote",
  async (id: string) => {
    const res = await axios.post("/api/admin/demote", { id });
    if (!res.data.success)
      throw new Error(res.data.error || "Failed to demote");
    return id;
  }
);

// Suspend admin
export const suspendAdmin = createAsyncThunk<string, string>(
  "admin/suspend",
  async (id: string) => {
    const res = await axios.post("/api/admin/suspend", { id });
    if (!res.data.success)
      throw new Error(res.data.error || "Failed to suspend");
    return id;
  }
);
// Fetch logs for a given admin
export const fetchAdminLogs = createAsyncThunk(
  "admin/logs",
  async (adminId: string) => {
    const res = await axios.get(`/api/admin/${adminId}/logs`);
    return { adminId, logs: res.data.data };
  }
);
// Reset admin password
export const resetAdminPassword = createAsyncThunk(
  "admin/resetPassword",
  async ({ id, newPassword }: any) => {
    const res = await axios.post("/api/admin/resetpassword", {
      id,
      newPassword,
    });
    if (!res.data.success)
      throw new Error(res.data.error || "Failed to reset password");
    return id;
  }
);

// Add this thunk for POST logging
export const logAdminActivity = createAsyncThunk(
  "admin/logActivity",
  async ({
    adminId,
    action,
    details,
  }: {
    adminId: string;
    action: string;
    details?: string;
  }) => {
    const res = await axios.post(`/api/admin/${adminId}/logs`, {
      action,
      details,
    });
    return res.data.log; // returns the new log entry
  }
);
// Create admin async thunk
export const createAdminAction = createAsyncThunk<
  Admin,
  { username: string; email: string; password: string; role: string },
  { rejectValue: string }
>("admin/create", async (adminData, { rejectWithValue }) => {
  try {
    const response = await axios.post("/api/admin/create", adminData);
    if (response.data.success) {
      return response.data.data as Admin;
    } else {
      return rejectWithValue(response.data.error);
    }
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.error || error.message);
  }
});

// Fetch all admins async thunk
export const fetchAdmins = createAsyncThunk<
  Admin[],
  void,
  { rejectValue: string }
>("admin/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const cookies = nookies.get(); // returns an object of cookies
    const token = cookies.token;
    console.log(token);
    const response = await axios.get("/api/admin/all", {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    if (response.data.success) {
      return response.data.data as Admin[];
    } else {
      return rejectWithValue(response.data.error);
    }
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.error || error.message);
  }
});

// Fetch admin by ID async thunk
export const fetchAdminById = createAsyncThunk<
  Admin,
  string,
  { rejectValue: string }
>("admin/fetchById", async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get(`/api/admin/${id}`);
    if (response.data.success) {
      return response.data.data as Admin;
    } else {
      return rejectWithValue(response.data.error);
    }
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.error || error.message);
  }
});

// Update admin async thunk
export const updateAdminAction = createAsyncThunk<
  Admin,
  {
    id: string;
    updates: Partial<{
      username: string;
      email: string;
      password: string;
      role: string;
    }>;
  },
  { rejectValue: string }
>("admin/update", async ({ id, updates }, { rejectWithValue }) => {
  try {
    const response = await axios.patch(`/api/admin/${id}`, updates);
    if (response.data.success) {
      return response.data.data as Admin;
    } else {
      return rejectWithValue(response.data.error);
    }
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.error || error.message);
  }
});

// Delete admin async thunk
export const deleteAdminAction = createAsyncThunk<
  Admin,
  string,
  { rejectValue: string }
>("admin/delete", async (id, { rejectWithValue }) => {
  try {
    const response = await axios.delete(`/api/admin/${id}`);
    if (response.data.success) {
      return response.data.data as Admin;
    } else {
      return rejectWithValue(response.data.error);
    }
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.error || error.message);
  }
});

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    // You can add synchronous actions here if needed
    clearCurrentAdmin(state) {
      state.currentAdmin = undefined;
    },
  },
  extraReducers: (builder) => {
    // Create admin
    builder.addCase(createAdminAction.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(createAdminAction.fulfilled, (state, action) => {
      state.loading = false;
      state.admins.push(action.payload);
    });
    builder.addCase(createAdminAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Fetch all admins
    builder.addCase(fetchAdmins.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(fetchAdmins.fulfilled, (state, action) => {
      state.loading = false;
      state.admins = action.payload;
    });
    builder.addCase(fetchAdmins.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Fetch admin by ID
    builder.addCase(fetchAdminById.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(fetchAdminById.fulfilled, (state, action) => {
      state.loading = false;
      state.currentAdmin = action.payload;
    });
    builder.addCase(fetchAdminById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(promoteAdmin.fulfilled, (state, action) => {
      const admin = state.admins.find((a) => a._id === action.payload);
      if (admin) admin.role = "superadmin";
    });
    builder.addCase(demoteAdmin.fulfilled, (state, action) => {
      const admin = state.admins.find((a) => a._id === action.payload);
      if (admin) admin.role = "admin";
    });
    builder.addCase(suspendAdmin.fulfilled, (state, action) => {
      const admin = state.admins.find((a) => a._id === action.payload);
      if (admin) admin.status = "suspended";
    });
    builder.addCase(resetAdminPassword.fulfilled, (state, action) => {
      // Optionally show toast or update state
    });
    // Update admin
    builder.addCase(updateAdminAction.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(updateAdminAction.fulfilled, (state, action) => {
      state.loading = false;
      // Update the admin in the list (or set as current admin)
      const index = state.admins.findIndex(
        (admin) => admin._id === action.payload._id
      );
      if (index !== -1) {
        state.admins[index] = action.payload;
      }
      if (state.currentAdmin && state.currentAdmin._id === action.payload._id) {
        state.currentAdmin = action.payload;
      }
    });
    builder.addCase(updateAdminAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    builder.addCase(deleteAdmin.fulfilled, (state, action) => {
      state.admins = state.admins.filter((a) => a._id !== action.payload);
    });
    builder.addCase(deleteAdmin.rejected, (state, action) => {
      state.error = action.payload as string;
    });
    builder.addCase(fetchAdminLogs.fulfilled, (state, action) => {
      state.logs = {
        ...state.logs,
        [action.payload.adminId]: action.payload.logs,
      };
    });
    // Handle adding new log entry
    builder.addCase(logAdminActivity.fulfilled, (state, action) => {
      const log = action.payload;
      if (log && log.adminId) {
        if (!state.logs[log.adminId]) state.logs[log.adminId] = [];
        state.logs[log.adminId].unshift(log);
      }
    });
  },
});

export const { clearCurrentAdmin } = adminSlice.actions;
export default adminSlice.reducer;
