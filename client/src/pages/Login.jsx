import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ AuthContext
  const { setUser } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1️⃣ Convert email to lowercase to avoid case-sensitivity issues
      const loginData = { 
        ...formData, 
        email: formData.email.toLowerCase() 
      };

      const res = await axios.post(
        "http://localhost:4000/api/auth/login",
        loginData
      );

      if (res.status === 200 && res.data.success) {
        const { token, user } = res.data;

        // ✅ Save token, id, role & email in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("userId", user._id); // 👈 userId needed for SubscriptionPage
        localStorage.setItem("userRole", user.role);
        localStorage.setItem("userEmail", user.email.toLowerCase()); // save lowercase email

        // ✅ Update AuthContext
        setUser({ email: user.email.toLowerCase(), role: user.role });

        alert("Login successful!");

        // ✅ Redirect according to role
        if (user.role === "admin") {
          navigate("/admin/dashboard"); // Admin dashboard → No change
        } else {
          navigate("/"); // Normal user → Home page
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow-lg" style={{ width: "380px" }}>
        <h3 className="text-center mb-4">Login to TailorOne</h3>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Email:</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-3">
            <label>Password:</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 mb-3">
            Login
          </button>
        </form>

        <div className="text-center">
          <Link to="/forgot-password" className="text-decoration-none me-2">
            Forgot Password?
          </Link>
          <br />
          <Link to="/register" className="text-decoration-none">
            New User? Register Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
