// src/pages/Profile.jsx
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState({ email: "", role: "" });

  useEffect(() => {
    // Load user info from context or localStorage
    if (user.email) {
      setUserInfo({ email: user.email, role: user.role });
    } else {
      const email = localStorage.getItem("userEmail");
      const role = localStorage.getItem("userRole");
      if (email && role) {
        setUserInfo({ email, role });
      } else {
        navigate("/login");
      }
    }
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    setUser({ email: null, role: null });
    navigate("/login");
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow-lg" style={{ maxWidth: "500px", margin: "auto" }}>
        <h3 className="text-center mb-4">My Profile</h3>

        <div className="mb-3">
          <strong>Email / Mobile:</strong> {userInfo.email}
        </div>
        <div className="mb-3">
          <strong>Role:</strong> {userInfo.role}
        </div>

        <button
          className="btn btn-primary w-100 mb-2"
          onClick={() => navigate("/my-orders")}
        >
          My Orders
        </button>

        <button
          className="btn btn-secondary w-100 mb-2"
          onClick={() => navigate("/address")}
        >
          Save Address
        </button>

        <button
          className="btn btn-info w-100 mb-2"
          onClick={() => navigate("/about-us")}
        >
          About Us
        </button>

        <button
          className="btn btn-warning w-100 mb-2"
          onClick={() => navigate("/privacy-policy")}
        >
          Privacy Policy
        </button>

        <button
          className="btn btn-danger w-100 mb-3"
          onClick={() => navigate("/return-policy")}
        >
          Return Policy
        </button>

        <button className="btn btn-outline-dark w-100" onClick={handleLogout}>
          Logout
        </button>

      </div>

      {/* ⬇⬇ EXTRA LARGE BOTTOM SPACE ⬇⬇ */}
      <div style={{ height: "90px" }}></div>  {/* Extra blank space at bottom */}

    </div>
  );
};

export default Profile;
