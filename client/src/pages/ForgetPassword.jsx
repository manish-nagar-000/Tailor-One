import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendOtpEmail, generateOtp, saveOtpToSession } from "../utils/sendOtp";

const ForgetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("Sending OTP...");

    // 🔹 Convert email to lowercase for consistency
    const normalizedEmail = email.toLowerCase();

    // 🔹 Generate OTP
    const otp = generateOtp();

    // 🔹 Save OTP & Email in sessionStorage (lowercase email)
    saveOtpToSession(normalizedEmail, otp);

    // 🔹 Send OTP via EmailJS
    sendOtpEmail(normalizedEmail, otp);

    setMessage("✅ OTP sent successfully!");

    // Redirect to ResetPassword page with normalized email
    setTimeout(() => {
      navigate("/reset-password", { state: { email: normalizedEmail } });
    }, 1200);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Forget Password</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          required
        />
        <button type="submit" style={styles.button}>Send OTP</button>
      </form>
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
};

const styles = {
  container: { maxWidth: "400px", margin: "80px auto", padding: "30px", backgroundColor: "#222", color: "#fff", borderRadius: "10px", boxShadow: "0px 0px 10px rgba(255,255,255,0.1)", textAlign: "center" },
  title: { marginBottom: "20px" },
  form: { display: "flex", flexDirection: "column", gap: "15px" },
  input: { padding: "10px", borderRadius: "6px", border: "1px solid #555", backgroundColor: "#333", color: "#fff" },
  button: { padding: "10px", backgroundColor: "#ffc107", color: "#222", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "16px", fontWeight: "600" },
  message: { marginTop: "10px" },
};

export default ForgetPassword;
