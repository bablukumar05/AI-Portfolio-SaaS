import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api"
});

// attach token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = token;
  return config;
});

// attached response interceptor to auto-logout on token expiration
API.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      
      // Only force redirect if they are actively using protected modules
      const protectedRoutes = ['/dashboard', '/builder', '/manage', '/resume', '/billing'];
      const isProtected = protectedRoutes.some(route => window.location.pathname.startsWith(route));
      
      if (isProtected) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default API;