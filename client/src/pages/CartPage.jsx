// src/pages/CartPage.jsx
import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate, Link } from "react-router-dom";

const CartPage = () => {
  const {
    cart,
    addItemToCart,
    removeFromCart,
    updateQty,
    totalAmount,
    clearCart,
  } = useContext(CartContext);

  const [offer, setOffer] = useState(null);
  const [finalAmount, setFinalAmount] = useState(totalAmount);
  const navigate = useNavigate();

  useEffect(() => {
    const applied = JSON.parse(localStorage.getItem("appliedOffer"));
    if (applied) setOffer(applied);
  }, []);

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

  const handleCheckout = () => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
    else navigate("/order");
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      clearCart();
      localStorage.removeItem("appliedOffer");
      setOffer(null);
      alert("Cart cleared after 10 minutes of inactivity.");
    }, 600000);

    return () => clearTimeout(timer);
  }, [cart, clearCart]);

  const removeOffer = () => {
    setOffer(null);
    localStorage.removeItem("appliedOffer");
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>Your Cart 🛒</h1>

      <div
        style={{
          display: "flex",
          gap: "15px",
          marginBottom: "25px",
          flexWrap: "wrap",
        }}
      >
        <Link
          to="/offers"
          style={{
            flex: "1 1 200px",
            padding: "15px",
            backgroundColor: "#ffe082",
            color: "#000",
            textDecoration: "none",
            fontWeight: "600",
            borderRadius: "12px",
            textAlign: "center",
            boxShadow: "0px 4px 15px rgba(0,0,0,0.2)",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.boxShadow = "0px 8px 20px rgba(0,0,0,0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0px)";
            e.currentTarget.style.boxShadow = "0px 4px 15px rgba(0,0,0,0.2)";
          }}
        >
          🎁 View All Offers
        </Link>

        <Link
          to="/subscription"
          style={{
            flex: "1 1 200px",
            padding: "15px",
            backgroundColor: "#81d4fa",
            color: "#000",
            textDecoration: "none",
            fontWeight: "600",
            borderRadius: "12px",
            textAlign: "center",
            boxShadow: "0px 4px 15px rgba(0,0,0,0.2)",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.boxShadow = "0px 8px 20px rgba(0,0,0,0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0px)";
            e.currentTarget.style.boxShadow = "0px 4px 15px rgba(0,0,0,0.2)";
          }}
        >
          ⭐ Subscription Plans
        </Link>
      </div>

      {cart.length === 0 ? (
        <p>No items in cart</p>
      ) : (
        <>
          {cart.map((item) => {
            let itemFinalPrice = item.price;
            if (offer) {
              if (offer.discount) itemFinalPrice -= offer.discount / cart.length;
              else if (offer.discountPercent)
                itemFinalPrice -= (item.price * offer.discountPercent) / 100;
            }

            return (
              <div
                key={item.id + "-" + item.type}
                style={{
                  marginBottom: "10px",
                  borderBottom: "1px solid #ccc",
                  paddingBottom: "8px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <h4>{item.name}</h4>
                  <p>
                    ₹{item.price.toFixed(2)} ×{" "}
                    <button
                      onClick={() => updateQty(item.id, item.qty - 1, item.type)}
                      disabled={item.qty <= 1}
                      style={{
                        padding: "2px 8px",
                        marginRight: "5px",
                        backgroundColor: "#dc3545",
                        color: "#fff",
                        border: "none",
                        borderRadius: "3px",
                        cursor: "pointer",
                      }}
                    >
                      -
                    </button>
                    {item.qty}
                    <button
                      onClick={() => addItemToCart({ ...item })}
                      style={{
                        padding: "2px 8px",
                        marginLeft: "5px",
                        backgroundColor: "#007bff",
                        color: "#fff",
                        border: "none",
                        borderRadius: "3px",
                        cursor: "pointer",
                      }}
                    >
                      +
                    </button>{" "}
                    = ₹{(itemFinalPrice * item.qty).toFixed(2)}
                  </p>

                  {offer && (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <small className="text-muted">
                        Offer applied:{" "}
                        {offer.discount
                          ? `₹${(offer.discount / cart.length).toFixed(2)} off per item`
                          : `${offer.discountPercent}% off`}
                      </small>
                      <button
                        onClick={removeOffer}
                        style={{
                          padding: "2px 6px",
                          backgroundColor: "#ff9800",
                          color: "#fff",
                          border: "none",
                          borderRadius: "3px",
                          cursor: "pointer",
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <button
                    onClick={() => removeFromCart(item.id, item.type)}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#6c757d",
                      color: "#fff",
                      border: "none",
                      borderRadius: "3px",
                      cursor: "pointer",
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}

          <h3>Subtotal: ₹{totalAmount.toFixed(2)}</h3>
          {offer && (
            <p>
              🎁 Offer Applied: <strong>{offer.code}</strong> —{" "}
              {offer.discount ? `₹${offer.discount} off` : `${offer.discountPercent}% off`}
            </p>
          )}
          <h2>Total Payable: ₹{finalAmount.toFixed(2)}</h2>

          <div style={{ marginTop: "15px" }}>
            <button
              className="btn btn-success"
              onClick={handleCheckout}
              style={{ marginRight: "10px" }}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}

      {/* ⬇⬇ EXTRA LARGE BOTTOM SPACE ⬇⬇ */}
      <div style={{ height: "100px" }}></div>  {/* YOU WANTED BIG SPACE */}

    </div>
  );
};

export default CartPage;
