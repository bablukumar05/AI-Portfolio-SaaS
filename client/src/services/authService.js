import API from "./api";

export const loginUser = (data) => {
  return API.post("/auth/login", data);
};

export const registerUser = (data) => {
  return API.post("/auth/register", data);
};

export const updateProfile = (data) => {
  return API.put("/auth/profile", data);
};

export const verifyOTP = (data) => {
  return API.post("/auth/verify-otp", data);
};

export const resendOTP = (data) => {
  return API.post("/auth/resend-otp", data);
};

export const forgotPassword = (data) => {
  return API.post("/auth/forgot-password", data);
};

export const resetPassword = (data) => {
  return API.post("/auth/reset-password", data);
};