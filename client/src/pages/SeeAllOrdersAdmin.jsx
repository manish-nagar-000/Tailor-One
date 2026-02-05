import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const SeeAllOrdersAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const prevOrderCount = useRef(0); // 🔹 For detecting new order
  const notificationCount = useRef(0); // 🔹 To limit notification times

  // 🔔 Function to play sound
  const playNotificationSound = () => {
    const audio = new Audio("/notification.mp3");
    audio.play().catch((err) => console.warn("Sound play blocked:", err));
  };

  // 🔔 Function to show browser notification
  const showNotification = (title, body) => {
    if (Notification.permission === "granted") {
      new Notification(title, { body, icon: "/favicon.ico" });
    }
  };

  // ✅ Request permission on load
  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  const fetchOrders = async () => {
    // Stop checking if already notified twice
    if (notificationCount.current >= 2) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You are not authorized. Please login.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(
        "http://localhost:4000/api/orders/all",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setOrders(res.data.orders);

        // 🔍 Compare with previous order count
        if (
          prevOrderCount.current &&
          res.data.orders.length > prevOrderCount.current
        ) {
          playNotificationSound();
          showNotification("🧾 New Order Received!", "A new order has been placed.");

          notificationCount.current += 1; // increment count

          // 🛑 Stop interval after 2 notifications
          if (notificationCount.current >= 2) {
            clearInterval(window.orderCheckInterval);
            console.log("🛑 Notifications stopped after 2 alerts.");
          }
        }

        // update ref
        prevOrderCount.current = res.data.orders.length;
      } else {
        setError("Failed to fetch orders");
      }
    } catch (err) {
      console.error(err);
      setError("Server error while fetching orders");
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Poll every 15 seconds
  useEffect(() => {
    fetchOrders();
    window.orderCheckInterval = setInterval(fetchOrders, 15000);
    return () => clearInterval(window.orderCheckInterval);
  }, []);

  if (loading) return <p className="text-center mt-4">Loading orders...</p>;
  if (error) return <p className="text-danger text-center mt-4">{error}</p>;

  return (
    <div style={{ padding: "15px" }}>
      <h2 style={{ textAlign: "center", color: "#007bff", marginBottom: "20px" }}>
        All Orders
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {orders.map((order, idx) => (
          <div
            key={order._id}
            style={{
              borderRadius: "10px",
              padding: "15px",
              backgroundColor: "#fdfdfd",
              boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
              border: "1px solid #eee",
            }}
          >
            <h5 style={{ color: "#007bff" }}>
              #{idx + 1} - Tracking ID: {order.trackingId || order._id}
            </h5>

            <p>
              <strong>Customer Phone: </strong>
              <span style={{ color: "#1a73e8", fontWeight: "bold" }}>
                {order.customerPhone}
              </span>
            </p>

            <p><strong>Customer ID:</strong> {order.customerId}</p>

            <p>
              <strong>Address:</strong>{" "}
              {order.address
                ? `${order.address.houseNo || ""}, ${order.address.street || ""}, ${
                    order.address.landmark ? "Landmark: " + order.address.landmark + ", " : ""
                  }${order.address.line1 || ""}, ${order.address.city || ""} - ${
                    order.address.pincode || ""
                  }`
                : "-"}
            </p>

            <p><strong>Delivery Within:</strong> {order.deliveryWithin}</p>

            <div style={{ marginBottom: "8px" }}>
              <strong>Services:</strong>
              {order.services.map((s) => (
                <div key={s._id} style={{ paddingLeft: "10px" }}>
                  {s.name} × {s.qty} = ₹{s.price * s.qty}
                </div>
              ))}
            </div>

            <p>
              <strong>Subtotal:</strong> ₹{order.subtotal.toFixed(2)} |{" "}
              <strong>Discount:</strong> ₹{order.discount?.toFixed(2) || 0} |{" "}
              <strong>Total:</strong> ₹{order.totalAmount.toFixed(2)}
            </p>

            <p>
              <strong>Payment Mode:</strong>{" "}
              <span
                style={{
                  color:
                    order.paymentMode.toLowerCase() === "cod" ||
                    order.paymentStatus.toLowerCase() === "paid"
                      ? "red"
                      : "green",
                  fontWeight: "bold",
                }}
              >
                {order.paymentMode} ({order.paymentStatus})
              </span>
            </p>

            <p>
              <strong>Order Status:</strong>{" "}
              <span style={{ color: "#007bff", fontWeight: "bold" }}>
                {order.orderStatus}
              </span>
            </p>

            <p>
              <strong>Pickup Time:</strong>{" "}
              {order.pickupTime ? new Date(order.pickupTime).toLocaleString() : "-"} |{" "}
              <strong>Delivery Time:</strong>{" "}
              {order.deliveryTime ? new Date(order.deliveryTime).toLocaleString() : "-"}
            </p>

            {order.notes && (
              <p style={{ color: "orange", fontWeight: "bold" }}>Notes: {order.notes}</p>
            )}
            {order.adminRemarks && (
              <p style={{ color: "purple", fontWeight: "bold" }}>
                Admin Remarks: {order.adminRemarks}
              </p>
            )}

            <p style={{ fontSize: "12px", color: "#555" }}>
              Created At: {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeeAllOrdersAdmin;
