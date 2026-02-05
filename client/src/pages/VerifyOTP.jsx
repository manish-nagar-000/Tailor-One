import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const [otpInput, setOtpInput] = useState("");
  const [msg, setMsg] = useState("");

  const handleVerify = async () => {
    const savedOtp = sessionStorage.getItem("reg_otp");
    const userData = JSON.parse(sessionStorage.getItem("reg_user"));
    const email = sessionStorage.getItem("reg_email");

    if (!savedOtp || !userData || !email) {
      setMsg("❌ Session expired! Please register again.");
      return;
    }

    // FRONTEND OTP MATCH
    if (otpInput !== savedOtp) {
      setMsg("❌ Invalid OTP. Try Again.");
      return;
    }

    try {
      // BACKEND REGISTER CALL
      const res = await axios.post("http://localhost:4000/api/auth/register", {
        name: userData.name,
        email: userData.email,
        password: userData.password,
      });

      console.log(res.data);
      setMsg("🎉 Account created successfully!");

      // CLEAR SESSION
      sessionStorage.removeItem("reg_user");
      sessionStorage.removeItem("reg_otp");
      sessionStorage.removeItem("reg_email");

      setTimeout(() => navigate("/login"), 1500);

    } catch (err) {
      console.log("REGISTER ERROR:", err.response?.data || err);
      if (err.response?.data?.error) setMsg(`❌ ${err.response.data.error}`);
      else setMsg("❌ Backend error — User not saved!");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Verify OTP</h2>

      <input
        type="text"
        placeholder="Enter OTP"
        value={otpInput}
        onChange={(e) => setOtpInput(e.target.value)}
        style={styles.input}
      />

      <button onClick={handleVerify} style={styles.button}>
        Verify & Create Account
      </button>

      {msg && <p style={styles.message}>{msg}</p>}
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
    borderRadius: "10px"
  },
  input: {
    padding: "10px",
    background: "#333",
    border: "1px solid #444",
    borderRadius: "6px",
    color: "#fff",
    width: "100%"
  },
  button: {
    marginTop: "15px",
    padding: "12px",
    background: "#28a745",
    color: "#fff",
    borderRadius: "6px"
  },
  message: {
    marginTop: "10px"
  }
};

export default VerifyOTP;
