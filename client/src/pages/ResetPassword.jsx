import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email } = location.state || {};

  const [otpInput, setOtpInput] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Processing...");

    const savedOtp = sessionStorage.getItem("user_otp");
    const savedEmail = sessionStorage.getItem("user_email");

    // 🔹 Convert both emails to lowercase for comparison
    const normalizedEmail = email?.toLowerCase();
    const normalizedSavedEmail = savedEmail?.toLowerCase();

    if (!savedOtp || !savedEmail || normalizedSavedEmail !== normalizedEmail) {
      setMessage("❌ OTP not found or expired. Request again.");
      return;
    }

    if (otpInput !== savedOtp) {
      setMessage("❌ Invalid OTP.");
      return;
    }

    try {
      // 🔥 BACKEND RESET PASSWORD API CALL (OTP removed)
      const res = await fetch("http://localhost:4000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: normalizedEmail, // send lowercase email
          newPassword: newPassword, // OTP removed
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("✅ Password Updated Successfully!");

        sessionStorage.removeItem("user_otp");
        sessionStorage.removeItem("user_email");

        setTimeout(() => navigate("/login"), 1500);
      } else {
        setMessage("❌ " + (data.error || "Failed to update password."));
      }
    } catch (err) {
      setMessage("❌ Server Error, Try again.");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Reset Password</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otpInput}
          onChange={(e) => setOtpInput(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="password"
          placeholder="Enter New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          style={styles.input}
          required
        />
        <button type="submit" style={styles.button}>
          Reset Password
        </button>
      </form>
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
};

// Same Styling
const styles = {
  container: {
    maxWidth: "400px",
    margin: "80px auto",
    padding: "30px",
    backgroundColor: "#222",
    color: "#fff",
    borderRadius: "10px",
    boxShadow: "0px 0px 10px rgba(255,255,255,0.1)",
    textAlign: "center",
  },
  title: { marginBottom: "20px" },
  form: { display: "flex", flexDirection: "column", gap: "15px" },
  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #555",
    backgroundColor: "#333",
    color: "#fff",
  },
  button: {
    padding: "10px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
  },
  message: { marginTop: "10px" },
};

export default ResetPassword;
