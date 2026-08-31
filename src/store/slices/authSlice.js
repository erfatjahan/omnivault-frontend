/* eslint-disable no-unused-vars */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";
import { toggleAuthPopup } from "./popupSlice";


export const register = createAsyncThunk(
  "auth/register",
  async (formData, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/auth/register", formData);
      toast.success(response.data.message || "Registration successful!");
      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
      }

      thunkAPI.dispatch(toggleAuthPopup());
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Registration failed. Please try again.";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (formData, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/auth/login", formData);
      toast.success(response.data.message || "Logged in successfully!");
      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
      }

      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Login failed. Invalid credentials.";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getuser = createAsyncThunk(
  "auth/getuser",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/auth/me");
      return response.data?.user || response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to load user profile.";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/auth/logout");
      toast.success(response.data.message || "Logged out successfully!");
      
      localStorage.removeItem("token");
      thunkAPI.dispatch(toggleAuthPopup());
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Logout failed.";
      toast.error(message);
      localStorage.removeItem("token");
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (emailData, thunkAPI) => {
    try {
      const payload = typeof emailData === "string" ? { email: emailData } : emailData;
      
      const response = await axiosInstance.post(
        "/auth/password/forgot",
        payload
      );
      toast.success(response.data.message || "Password reset link sent to your email!");
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to send reset link. Please check your email.";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, password, confirmPassword }, thunkAPI) => {
    try {
      const response = await axiosInstance.put(
        `/auth/password/reset/${token}`,
        { password, confirmPassword }
      );
      toast.success(response.data.message || "Password reset successful!");
      return response.data?.user || response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to reset password. Link may be expired.";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updatePassword = createAsyncThunk(
  "auth/updatePassword",
  async (data, thunkAPI) => {
    try {
      const response = await axiosInstance.put("/auth/password/update", data);
      toast.success(response.data.message || "Password updated successfully!");
      return response.data?.user || response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to update password.";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);
export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (data, thunkAPI) => {
    try {
      const response = await axiosInstance.put("/auth/profile/update", data);
      toast.success(response.data.message || "Profile updated successfully!");
      return response.data?.user || response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update profile.";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    authUser: null,
    isAuthenticated: false,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isUpdatingPassword: false,
    isRequestingForToken: false,
    isCheckingAuth: true,
    error: null,
  },
  reducers: {
    clearAuthErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.isSigningUp = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isSigningUp = false;
        state.isAuthenticated = true;
        state.authUser = action.payload?.user || action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.isSigningUp = false;
        state.error = action.payload;
      })

      // Login
      .addCase(login.pending, (state) => {
        state.isLoggingIn = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggingIn = false;
        state.isAuthenticated = true;
        state.authUser = action.payload?.user || action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoggingIn = false;
        state.isAuthenticated = false;
        state.authUser = null;
        state.error = action.payload;
      })

      // Get User (Session Check)
      .addCase(getuser.pending, (state) => {
        state.isCheckingAuth = true;
      })
      .addCase(getuser.fulfilled, (state, action) => {
        state.isCheckingAuth = false;
        state.isAuthenticated = true;
        state.authUser = action.payload?.user || action.payload;
      })
      .addCase(getuser.rejected, (state, action) => {
        state.isCheckingAuth = false;
        state.isAuthenticated = false;
        state.authUser = null;
      })

      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.authUser = null;
        state.isAuthenticated = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.authUser = null;
        state.isAuthenticated = false;
        state.error = action.payload;
      })

      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.isRequestingForToken = true;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isRequestingForToken = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isRequestingForToken = false;
        state.error = action.payload;
      })

      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.isUpdatingPassword = true;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isUpdatingPassword = false;
        state.authUser = action.payload?.user || action.payload;
        state.isAuthenticated = true;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isUpdatingPassword = false;
        state.error = action.payload;
      })

      // Update Password
      .addCase(updatePassword.pending, (state) => {
        state.isUpdatingPassword = true;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.isUpdatingPassword = false;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.isUpdatingPassword = false;
        state.error = action.payload;
      })

      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.isUpdatingProfile = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isUpdatingProfile = false;
        state.authUser = action.payload?.user || action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isUpdatingProfile = false;
        state.error = action.payload;
      });
  },
});

export const { clearAuthErrors } = authSlice.actions;
export default authSlice.reducer;