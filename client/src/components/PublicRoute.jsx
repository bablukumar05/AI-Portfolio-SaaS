import { Navigate } from "react-router-dom";

export default function PublicRoute({ children }) {
  const token = localStorage.getItem("token");
  
  if (token) {
    // If user is already authenticated, redirect to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  // Not authenticated, allow to render the public page (Login/Register)
  return children;
}
