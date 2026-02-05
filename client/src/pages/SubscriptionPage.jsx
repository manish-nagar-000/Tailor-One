import React, { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "./SubscriptionPage.css"; // ✅ Import CSS here

const SubscriptionPage = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [userSubscriptions, setUserSubscriptions] = useState([]);
  const { cart, addItemToCart, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate();
  const prevData = useRef([]);

  const BASE_URL = "http://localhost:4000/api/subscriptions";

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedToken = localStorage.getItem("token");

    if (!storedUserId || !storedToken) {
      alert("Please login first to view subscriptions.");
      navigate("/login");
      return;
    }

    if ("Notification" in window) {
      Notification.requestPermission();
    }

    fetchSubscriptions();
    fetchUserSubscriptions(storedUserId, storedToken);

    window.subscriptionInterval = setInterval(checkNewSubscriptions, 15000);

    return () => clearInterval(window.subscriptionInterval);
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const res = await axios.get(BASE_URL);
      if (res.data.success) {
        setSubscriptions(res.data.subscriptions);
        prevData.current = res.data.subscriptions;
      }
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
    }
  };

  const fetchUserSubscriptions = async (userId, token) => {
    try {
      const res = await axios.get(`${BASE_URL}/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setUserSubscriptions(res.data.subscriptions);
    } catch (err) {
      console.error("Error fetching user subscriptions:", err);
    }
  };

  const checkNewSubscriptions = async () => {
    try {
      const res = await axios.get(BASE_URL);
      const newData = res.data.subscriptions || [];

      if (prevData.current.length > 0) {
        const oldIds = prevData.current.map((s) => s._id);
        const newOnes = newData.filter((s) => !oldIds.includes(s._id));

        if (newOnes.length > 0) {
          // 🔊 Play Sound twice
          const audio = new Audio("/new-service.mp3");
          audio.play().catch((err) => console.warn("Sound blocked:", err));
          setTimeout(() => {
            const second = new Audio("/new-service.mp3");
            second.play().catch((err) => console.warn("Sound blocked:", err));
          }, 1200);

          // 🔔 Show Notification
          if ("Notification" in window && Notification.permission === "granted") {
            newOnes.forEach((s) => {
              new Notification("📢 New Subscription Added!", {
                body: `${s.name} - ₹${s.price}`,
                icon: "/logo192.png",
              });
            });
          }

          setSubscriptions(newData);
          prevData.current = newData;
        }
      } else {
        prevData.current = newData;
        setSubscriptions(newData);
      }
    } catch (error) {
      console.error("Error checking new subscriptions:", error);
    }
  };

  const isInCart = (subId) =>
    cart.some((item) => item.id === subId && item.type === "subscription");

  const handleAddToCart = (sub) => {
    if (!isInCart(sub._id)) {
      addItemToCart({
        id: sub._id,
        name: sub.name,
        price: sub.price,
        type: "subscription",
        durationDays: sub.durationDays,
        clothLimit: sub.clothLimit,
      });
    }
  };

  const handleRemoveFromCart = (subId) => removeFromCart(subId, "subscription");

  return (
    <div className="subscription-wrapper">
      <h1>Available Subscriptions</h1>
      <div className="subscriptions-grid">
        {subscriptions.map((sub) => {
          const userSub = userSubscriptions.find(
            (us) =>
              us.subscriptionId &&
              us.subscriptionId._id === sub._id &&
              us.status === "active"
          );
          const inCart = isInCart(sub._id);

          return (
            <div className="subscription-card" key={sub._id}>
              <h3>{sub.name}</h3>
              <p>
                <strong>Price:</strong> ₹{sub.price}
              </p>
              <p>
                <strong>Duration:</strong> {sub.durationDays} days
              </p>
              <p>
                <strong>Cloth Limit:</strong> {sub.clothLimit} clothes
              </p>

              {sub.benefits?.length > 0 && (
                <ul>
                  {sub.benefits.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              )}

              {userSub ? (
                <div className="active-subscription">
                  <p>✅ Active Subscription</p>
                  <p>
                    Cloth Used: {userSub.clothUsed} / {userSub.clothLimit}
                  </p>
                  <p>
                    Ends on:{" "}
                    {userSub.expiryDate
                      ? new Date(userSub.expiryDate).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              ) : inCart ? (
                <button className="remove-btn" onClick={() => handleRemoveFromCart(sub._id)}>
                  Remove from Cart
                </button>
              ) : (
                <button className="add-btn" onClick={() => handleAddToCart(sub)}>
                  Add to Cart
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SubscriptionPage;
