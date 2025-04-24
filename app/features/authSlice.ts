// features/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface User {
  _id: string;
  email: string;
  role: "admin" | "superadmin" | "teacher" | "guest";
  username: string;
  status: "pending" | "active" | "rejected";
}
interface AuthData {
  user: User;
  token: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  registrationMessage?: string;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  registrationMessage: undefined,
};

// 🔑 Login Admin Action
export const loginUser = createAsyncThunk<
  AuthData,
  { email: string; password: string },
  { rejectValue: string }
>("auth/loginUser", async (credentials, { rejectWithValue }) => {
  try {
    // Call the login API endpoint
    const response = await axios.post("/api/admin/login", credentials);
    const { token, username, role, email } = response.data.data;
    if (response.data.success) {
      return {
        user: { username, role, email },
        token,
      } as AuthData;
    } else {
      return rejectWithValue(response.data.error);
    }
  } catch (error: any) {
    //console.error("authSlice: loginUser error =", error);
    return rejectWithValue(error.response?.data?.error || error.message);
  }
});

// Async thunk for registering a new user/admin
// 🔒 Register Admin Action
export const registerUser = createAsyncThunk<
  // Returns a confirmation message (e.g., "Account created pending approval")
  string,
  { username: string; email: string; password: string },
  { rejectValue: string }
>("auth/registerUser", async (userData, { rejectWithValue }) => {
  try {
    // Call the registration API endpoint
    const response = await axios.post("/api/admin/register", userData);
    if (response.data.success) {
      return response.data.data as string;
    } else {
      return rejectWithValue(response.data.error);
    }
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.error || error.message);
  }
});

// 🔙 Logout Action
export const logoutUser = createAsyncThunk<null, void, { rejectValue: string }>(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await axios.post("/api/auth/logout"); // Clear server-side session
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
      return null;
    } catch (error: any) {
      return rejectWithValue("Logout failed. Please try again.");
    }
  }
);

// 🔑 Verify Token (for auto-login)
export const verifyToken = createAsyncThunk<
  AuthState["user"],
  void,
  { rejectValue: string }
>("auth/verifyToken", async (_, { rejectWithValue }) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (!token) {
    return rejectWithValue("No token found. Please log in.");
  }
  try {
    const response = await axios.get("/api/auth/verify", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.user;
  } catch (error: any) {
    return rejectWithValue("Token verification failed. Please log in again.");
  }
});
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null; // Clear user data
      state.token = null;
      state.error = null;
      state.registrationMessage = undefined;
      if (typeof window !== "undefined") {
        localStorage.removeItem("token"); // Clear token from local storage
      }
    },
    clearRegistrationMessage(state) {
      state.registrationMessage = undefined; // Clear the registration message
    },
  },
  extraReducers: (builder) => {
    // Handling login actions
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loading = false;
      if (typeof window !== "undefined" && action.payload.token) {
        localStorage.setItem("token", action.payload.token);
      }
    });
    builder.addCase(
      loginUser.rejected,
      (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      }
    );

    // Handling registration actions
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.registrationMessage = undefined;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.loading = false;
      // The registration process typically doesn't log the user in immediately.
      // Instead, we store a message such as "Account created pending approval."
      state.registrationMessage = action.payload;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Registration failed";
    });
    // 🔙 Logout User
    builder.addCase(logoutUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.token = null;
      state.loading = false;
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
    });
    builder.addCase(logoutUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Logout failed";
    });

    // 🔑 Verify Token (auto-login)
    builder.addCase(verifyToken.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(verifyToken.fulfilled, (state, action) => {
      state.user = action.payload;
      state.loading = false;
    });
    builder.addCase(verifyToken.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Verification failed";
    });
  },
});

export const { logout, clearRegistrationMessage } = authSlice.actions;
export default authSlice.reducer;
