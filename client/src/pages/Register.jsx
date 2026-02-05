import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendOtpEmail, generateOtp } from "../utils/sendOtp";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Processing...");

    try {
      // 1️⃣ Convert email to lowercase to avoid case-sensitivity issues
      const emailLower = formData.email.toLowerCase();

      // 2️⃣ OTP frontend generate
      const otp = generateOtp();

      // 3️⃣ Save for Verify Page use
      const regUser = { ...formData, email: emailLower }; // store lowercase email
      sessionStorage.setItem("reg_user", JSON.stringify(regUser));
      sessionStorage.setItem("reg_otp", otp);
      sessionStorage.setItem("reg_email", emailLower);

      // 4️⃣ Send OTP to email
      await sendOtpEmail(emailLower, otp);

      setMessage("🎉 OTP sent to Email!");

      // 5️⃣ Move to verify page
      setTimeout(() => navigate("/verify-otp"), 1200);

    } catch (error) {
      console.log("OTP Error:", error);
      setMessage("❌ Failed to send OTP");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Create Account</h2>

      <form onSubmit={handleSubmit} style={styles.form}>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          Send OTP
        </button>
      </form>

      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "400px",
    margin: "60px auto",
    padding: "25px",
    background: "#222",
    color: "#fff",
    borderRadius: "10px",
  },
  form: { display: "flex", flexDirection: "column", gap: "14px" },
  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #444",
    background: "#333",
    color: "#fff",
  },
  button: {
    padding: "12px",
    background: "#007bff",
    borderRadius: "6px",
    color: "#fff",
  },
  message: { marginTop: "10px" },
};

export default Register;
