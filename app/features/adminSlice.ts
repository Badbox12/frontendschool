import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import nookies from 'nookies';
// Define the type for an admin
export interface Admin {
  _id: string;
  username: string;
  email: string;
  role: string;
  // add other fields as needed
}

interface AdminState {
  admins: Admin[];
  currentAdmin?: Admin;
  loading: boolean;
  error?: string;
  role?: string;
}

const initialState: AdminState = {
  admins: [],
  loading: false,
  error: undefined,
};

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
    const token = cookies.token
    console.log(token)
    const response = await axios.get("/api/admin/all",{
      headers: {
        Authorization: token ? `Bearer ${token}` :''
      }
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

    // Delete admin
    builder.addCase(deleteAdminAction.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(deleteAdminAction.fulfilled, (state, action) => {
      state.loading = false;
      // Remove the admin from the list
      state.admins = state.admins.filter(
        (admin) => admin._id !== action.payload._id
      );
    });
    builder.addCase(deleteAdminAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { clearCurrentAdmin } = adminSlice.actions;
export default adminSlice.reducer;
