import React from "react";
import { Link, useLocation } from "react-router-dom";

const PaymentSuccess = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const reference = queryParams.get("reference"); // razorpay_payment_id

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "80vh",
        textAlign: "center",
        fontFamily: "Poppins, sans-serif",
        padding: "20px",
      }}
    >
      {/* ✅ Success Icon */}
      <div
        style={{
          fontSize: "80px",
          color: "#28a745",
          marginBottom: "20px",
        }}
      >
        ✔
      </div>

      {/* ✅ Success Message */}
      <h1 style={{ fontSize: "36px", marginBottom: "10px" }}>
        Payment Successful!
      </h1>
      {reference && (
        <p style={{ fontSize: "18px", color: "#555", marginBottom: "30px" }}>
          Reference ID: <strong>{reference}</strong>
        </p>
      )}
      <p style={{ fontSize: "16px", color: "#777", marginBottom: "40px" }}>
        Thank you for your payment. Your order is being processed.
      </p>

      {/* ✅ Go Home Button */}
      <Link
        to="/"
        style={{
          padding: "12px 30px",
          backgroundColor: "#3399cc",
          color: "#fff",
          textDecoration: "none",
          borderRadius: "6px",
          fontSize: "16px",
          fontWeight: "500",
        }}
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default PaymentSuccess;
