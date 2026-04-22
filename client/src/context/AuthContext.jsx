import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      // Decoding or fetching /api/auth/me can happen here
      setUser({ authenticated: true });
    } else {
      localStorage.removeItem("token");
      setUser(null);
    }
  }, [token]);

  const logout = () => {
    setToken(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ token, setToken, user, logout }}>
      {children}
    </AuthContext.Provider>
  );
}