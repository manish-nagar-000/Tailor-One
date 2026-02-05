// src/components/CartFooterBar.jsx
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { FaShoppingCart } from "react-icons/fa";
import "./CartFooterBar.css";

const CartFooterBar = () => {
  const { cart, totalAmount } = useContext(CartContext);
  const navigate = useNavigate();

  const [offer, setOffer] = useState(null);
  const [finalAmount, setFinalAmount] = useState(totalAmount);

  // 🔹 Load offer from localStorage (same as CartPage)
  useEffect(() => {
    const applied = JSON.parse(localStorage.getItem("appliedOffer"));
    if (applied) setOffer(applied);
  }, []);

  // 🔥 TOTAL CALCULATION — SAME AS CART PAGE 🔥
  useEffect(() => {
    let total = 0;
    cart.forEach((item) => {
      let itemFinalPrice = item.price;

      if (offer) {
        if (offer.discount) itemFinalPrice -= offer.discount / cart.length;
        else if (offer.discountPercent)
          itemFinalPrice -= (item.price * offer.discountPercent) / 100;
      }

      total += itemFinalPrice * item.qty;
    });

    setFinalAmount(Math.max(total, 0));
  }, [cart, offer]);

  // Remove offer — Same function as CartPage
  const removeOffer = () => {
    setOffer(null);
    localStorage.removeItem("appliedOffer");
  };

  // total item count
  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);

  // No footer if cart empty
  if (totalItems === 0) return null;

  return (
    <div className="cart-footer-bar">

      <div className="cart-footer-left" onClick={() => navigate("/cart")}>
        <FaShoppingCart size={22} />

        <span style={{ fontWeight: "600" }}>
          {totalItems} item{totalItems > 1 ? "s" : ""} • Subtotal ₹{totalAmount.toFixed(2)}
        </span>

        {offer && (
          <small style={{ marginLeft: 6, color: "#ffce00", fontWeight: 600 }}>
            🎁 {offer.code} Applied
          </small>
        )}
      </div>

      <div className="cart-footer-right">
        <span className="final-pay-text" onClick={() => navigate("/cart")}>
          Pay ₹{finalAmount.toFixed(2)}
        </span>

        {offer && (
          <button
            onClick={removeOffer}
            style={{
              background: "#ff7e00",
              border: "none",
              color: "#fff",
              padding: "3px 8px",
              marginLeft: "10px",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            Remove Offer ❌
          </button>
        )}
      </div>

    </div>
  );
};

export default CartFooterBar;
