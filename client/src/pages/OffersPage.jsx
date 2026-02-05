import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const OffersPage = () => {
  const { applyOffer } = useContext(CartContext);
  const [offers, setOffers] = useState([]);
  const navigate = useNavigate(); // 🔹 useNavigate for redirect

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/offers");
        setOffers(res.data.success ? res.data.offers : []);
      } catch (err) {
        console.error("Failed to fetch offers:", err);
        setOffers([]);
      }
    };
    fetchOffers();
  }, []);

  const handleApply = (offer) => {
    // Apply offer in context
    applyOffer(offer);
    // Save in localStorage for persistence
    localStorage.setItem("appliedOffer", JSON.stringify(offer));
    alert(`Offer ${offer.code} applied!`);

    // 🔹 Redirect to cart page immediately
    navigate("/cart");
  };

  if (offers.length === 0) {
    return <p style={{ padding: "20px" }}>No offers available currently.</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Available Offers 🎁</h1>
      {offers.map((offer) => (
        <div
          key={offer._id}
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "15px",
            marginBottom: "15px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
          }}
        >
          <h3 style={{ marginBottom: "8px" }}>{offer.title}</h3>
          <p style={{ marginBottom: "5px" }}>{offer.description}</p>
          {offer.discount && <p>💰 Flat ₹{offer.discount} off</p>}
          {offer.discountPercent && <p>💸 {offer.discountPercent}% off</p>}
          <p>Min Amount: ₹{offer.minAmount}</p>
          <p>Valid Till: {new Date(offer.validTill).toLocaleDateString()}</p>
          <button
            onClick={() => handleApply(offer)}
            style={{
              marginTop: "10px",
              padding: "8px 14px",
              backgroundColor: "#ff9900",
              color: "#fff",
              fontWeight: "600",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e68a00")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ff9900")}
          >
            Apply Coupon
          </button>
        </div>
      ))}
    </div>
  );
};

export default OffersPage;
