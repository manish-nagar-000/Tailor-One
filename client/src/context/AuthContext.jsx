// src/context/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // ✅ Token include kiya gaya hai
  const [user, setUser] = useState({
    email: localStorage.getItem("userEmail"),
    role: localStorage.getItem("userRole"),
    token: localStorage.getItem("token"), // token add
  });

  useEffect(() => {
    const handleStorage = () => {
      setUser({
        email: localStorage.getItem("userEmail"),
        role: localStorage.getItem("userRole"),
        token: localStorage.getItem("token"), // token update
      });
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom hook to use AuthContext anywhere
export const useAuth = () => useContext(AuthContext);
