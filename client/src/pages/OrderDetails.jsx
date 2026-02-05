import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";

const OrderDetails = () => {
  const { orderId } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.token || !orderId) return;

    const fetchOrder = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/orders/${orderId}`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        setOrder(response.data.order);
      } catch (err) {
        console.error("❌ Error fetching order details:", err);
        setError("Failed to load order details. Please login again.");
      }
    };

    fetchOrder();
  }, [orderId, user]);

  if (error) 
    return <div style={{ textAlign: "center", padding: "50px", color: "red", fontWeight: "bold" }}>{error}</div>;
  if (!order) 
    return <div style={{ textAlign: "center", padding: "50px" }}>Loading order details...</div>;

  const { address, services, deliveryWithin, notes } = order;

  // Function to get color based on status
  const statusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending": return "#ffc107"; // yellow
      case "confirmed": return "#17a2b8"; // blue
      case "delivered": return "#28a745"; // green
      case "cancelled": return "#dc3545"; // red
      default: return "#6c757d"; // gray
    }
  };

  return (
    <div style={{ padding: "15px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#007bff" }}>Order Details</h2>

      <div style={{
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        backgroundColor: "#fff",
        padding: "20px",
        marginBottom: "20px",
      }}>
        {/* Header Section */}
        <div style={{ padding: "10px", backgroundColor: "#f0f8ff", borderRadius: "8px", marginBottom: "15px" }}>
          <h4 style={{ margin: "0 0 5px 0", color: "#007bff" }}>Tracking ID: {order.trackingId || order._id}</h4>
          <span style={{ fontWeight: "bold", color: statusColor(order.orderStatus), padding: "4px 8px", borderRadius: "5px", backgroundColor: "#f1f1f1" }}>
            {order.orderStatus}
          </span>
        </div>

        {/* Payment & Amount */}
        <div style={{ marginBottom: "15px" }}>
          <p style={{ margin: "5px 0" }}><strong>Payment Mode:</strong> {order.paymentMode}</p>
          <p style={{ margin: "5px 0" }}><strong>Payment Status:</strong> {order.paymentStatus}</p>
          <p style={{ margin: "5px 0" }}><strong>Total Amount:</strong> ₹{order.totalAmount}</p>
          <p style={{ margin: "5px 0", color: "#28a745" }}><strong>Discount:</strong> ₹{order.discount}</p>
          <p style={{ margin: "5px 0" }}>
            <strong>Delivery Within:</strong> {deliveryWithin}{" "}
            {deliveryWithin === "12 hours" && (
              <span style={{ color: "red", fontWeight: "bold" }}>
                ⚡ Fast delivery selected! Price increased.
              </span>
            )}
          </p>
        </div>

        {/* Customer Info */}
        <div style={{ marginBottom: "15px", padding: "10px", backgroundColor: "#f9f9f9", borderRadius: "8px" }}>
          <h5 style={{ color: "#007bff" }}>Customer Info</h5>
          <p><strong>ID:</strong> {order.customerId}</p>
          <p><strong>Phone:</strong> {order.customerPhone}</p>
        </div>

        {/* Address */}
        <div style={{ marginBottom: "15px", padding: "10px", backgroundColor: "#e9f7ef", borderRadius: "8px" }}>
          <h5 style={{ color: "#28a745" }}>Delivery Address</h5>
          <p>
            {address?.houseNo ? `${address.houseNo}, ` : ""}
            {address?.street ? `${address.street}, ` : ""}
            {address?.landmark ? `Landmark: ${address.landmark}, ` : ""}
            {address?.line1 ? `${address.line1}, ` : ""}
            {address?.city ? `${address.city} - ` : ""}
            {address?.pincode || ""}
          </p>
        </div>

        {/* Services */}
        <div style={{ marginBottom: "15px", padding: "10px", backgroundColor: "#fff3cd", borderRadius: "8px" }}>
          <h5 style={{ color: "#856404" }}>Services</h5>
          <ul style={{ paddingLeft: "20px" }}>
            {services.map((item) => (
              <li key={item._id} style={{ marginBottom: "5px" }}>
                {item.name} × {item.qty} — ₹{item.price}
              </li>
            ))}
          </ul>
        </div>

        {/* Pickup & Notes */}
        <div style={{ marginBottom: "10px", padding: "10px", backgroundColor: "#f8d7da", borderRadius: "8px" }}>
          <p><strong>Pickup Time:</strong> {new Date(order.pickupTime).toLocaleString()}</p>
          {notes && <p style={{ color: "#721c24", fontWeight: "bold" }}>Note: {notes}</p>}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
