import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={{ minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
      {/* Navbar */}
      <nav
        style={{
          width: "100%",
          backgroundColor: "#222",
          color: "white",
          padding: "12px 18px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 999,
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
        }}
      >
        <h3 style={{ margin: 0, fontSize: "1.1rem" }}>TailorOne Admin</h3>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{
            background: "transparent",
            border: "none",
            color: "white",
            fontSize: "26px",
            cursor: "pointer",
          }}
        >
          ☰
        </button>
      </nav>

      {/* Sliding Menu */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: isMenuOpen ? 0 : "-250px", // slide effect
          width: "250px",
          height: "100%",
          backgroundColor: "#333",
          color: "white",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          paddingTop: "60px",
          transition: "left 0.3s ease",
          boxShadow: "2px 0 12px rgba(0,0,0,0.4)",
        }}
      >
        {[
          { path: "/admin/dashboard/subscription", label: "📦 Subscription" },
          { path: "/admin/dashboard/offers", label: "💰 Offers" },
          { path: "/admin/dashboard/service", label: "🧵 Services" },
          { path: "/admin/dashboard/all-Orders", label: "📋 All Orders" },
          { path: "/admin/dashboard/offer-status", label: "🚚 Order Status" },
        ].map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              color: "#ffdd59",
              textDecoration: "none",
              padding: "15px 20px",
              fontSize: "17px",
              fontWeight: "500",
              borderBottom: "1px solid #444",
            }}
            onClick={() => setIsMenuOpen(false)}
            onMouseEnter={(e) => (e.target.style.color = "#ff6b6b")}
            onMouseLeave={(e) => (e.target.style.color = "#ffdd59")}
          >
            {item.label}
          </Link>
        ))}

        <button
          onClick={() => {
            handleLogout();
            setIsMenuOpen(false);
          }}
          style={{
            marginTop: "20px",
            backgroundColor: "#ff4757",
            border: "none",
            color: "white",
            fontSize: "16px",
            padding: "12px 20px",
            borderRadius: "8px",
            margin: "10px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#e84118")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#ff4757")}
        >
          🚪 Logout
        </button>
      </div>

      {/* Page Content */}
      <div
        style={{
          padding: "20px 15px",
          backgroundColor: "#f9f9f9",
          borderTop: "1px solid #ddd",
          minHeight: "100vh",
        }}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;
