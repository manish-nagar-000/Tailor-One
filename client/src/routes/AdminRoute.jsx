import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // ✅ correct import for v4+

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);

    // ✅ Check if role = admin
    if (decoded.role !== "admin") {
      alert("Access denied! Admin only area.");
      return <Navigate to="/" replace />;
    }

    return children; // ✅ Allow access
  } catch (err) {
    console.error("Invalid token", err);
    return <Navigate to="/login" replace />;
  }
};

export default AdminRoute;
