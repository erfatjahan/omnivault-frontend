/* eslint-disable no-unused-vars */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";
import { data } from "autoprefixer";
import {toggleAuthPopup} from "./popupSlice"
export const register = createAsyncThunk(
  "auth/register",
  async (data, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/auth/register",data);
      toast.success(response.data.message || "Registration successful!");
      thunkAPI.dispatch(toggleAuthPopup());
      return response.data.user;
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
  async (data, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/auth/login",data);
      toast.success(response.data.message || "Logged in successfully!");
      return response.data.user;
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
      return response.data.user;
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
      thunkAPI.dispatch(toggleAuthPopup());
      return response.data.user;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Logout failed.";
      toast.error(message);
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
        "/auth/password/forgot?frontendurl=http://localhost:5173",
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
      return response.data.user || response.data;
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
      return response.data.user || response.data;
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
  "auth/me/update",
  async (data, thunkAPI) => {
    try {
      const response = await axiosInstance.put("/auth/profile/update", data);
      toast.success(response.data.message);
      return response.data.user;
    } catch (error) {
      const message =
        error.response.data.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);
const authSlice = createSlice({
  name: "auth",
  initialState: {
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isUpdatingPassword: false,
    isRequestingForToken: false,
    isCheckingAuth: true,
  },
  extraReducers: (builder) => {
    builder
    .addCase(register.pending,(state) =>{
      state.isSigningUp=true;
    })
   .addCase(register.fulfilled,(state,action) =>{
      state.isSigningUp=false;
      state.authUser=action.payload;
    })
    .addCase(register.rejected,(state) =>{
      state.isSigningUp=false;
    })
    .addCase(login.pending,(state) =>{
      state.isLoggingIn=true;
    })
   .addCase(login.fulfilled,(state,action) =>{
      state.isLoggingIn=false;
      state.authUser=action.payload;
    })
    .addCase(login.rejected,(state) =>{
      state.isLoggingIn=false;
    })
    .addCase(getuser.pending,(state,action) =>{
      state.isCheckingAuth=true;
      // state.authUser=null;
    })
    .addCase(getuser.fulfilled,(state,action) =>{
      state.isCheckingAuth=false;
      state.authUser=action.payload;
    })
    .addCase(getuser.rejected,(state,action) =>{
      state.isCheckingAuth=false;
      state.authUser=null;
    })
    .addCase(logout.fulfilled,(state,action) =>{
      state.authUser=null;
    })
    .addCase(logout.rejected,(state,action) =>{
      state.authUser = null;
      state.error=action.payload
    })
    .addCase(forgotPassword.pending,(state) =>{
      state.isRequestingForToken=true;
    })
   .addCase(forgotPassword.fulfilled,(state,action) =>{
      state.isRequestingForToken=false;
    })
    .addCase(forgotPassword.rejected,(state) =>{
      state.isRequestingForToken=false;
    })
     .addCase(resetPassword.pending,(state) =>{
      state.isUpdatingPassword=true;
    })
   .addCase(resetPassword.fulfilled,(state,action) =>{
      state.isUpdatingPassword=false;
      state.authUser=action.payload;
    })
    .addCase(resetPassword.rejected,(state) =>{
      state.isUpdatingPassword=false;
    })
     .addCase(updatePassword.pending,(state) =>{
      state.isRequestingForToken=true;
    })
   .addCase(updatePassword.fulfilled,(state,action) =>{
      state.isRequestingForToken=false;
    })
    .addCase(updatePassword.rejected,(state) =>{
      state.isRequestingForToken=false;
    })
     .addCase(updateProfile.pending,(state) =>{
      state.isUpdatingProfile=true;
    })
   .addCase(updateProfile.fulfilled,(state,action) =>{
      state.isUpdatingProfile=false;
      state.authUser=action.payload;
    })
    .addCase(updateProfile.rejected,(state) =>{
      state.isUpdatingProfile=false;
    })
  },
});

export default authSlice.reducer;
