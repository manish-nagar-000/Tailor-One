import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          "http://localhost:4000/api/orders/my-orders",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOrders(res.data.orders);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch orders.");
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  if (loading) return <div style={{ textAlign: "center", marginTop: "50px" }}>Loading your orders...</div>;
  if (error) return <div style={{ textAlign: "center", marginTop: "50px", color: "red" }}>{error}</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#007bff" }}>My Orders</h2>
      {orders.length === 0 ? (
        <p style={{ textAlign: "center", fontSize: "16px", color: "#555" }}>You have no orders yet.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            style={{
              marginBottom: "20px",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              background: "#fff",
              borderLeft: "5px solid #007bff",
            }}
          >
            <div style={{ padding: "15px", backgroundColor: "#f0f8ff" }}>
              <strong style={{ color: "#007bff" }}>Order ID:</strong> {order._id} |{" "}
              <strong style={{ color: "#28a745" }}>Tracking:</strong> {order.trackingId}
            </div>
            <div style={{ padding: "15px" }}>
              <h5 style={{ color: "#333", marginBottom: "10px" }}>Services:</h5>
              <ul style={{ paddingLeft: "20px", marginBottom: "10px" }}>
                {order.services.map((service) => (
                  <li key={service._id} style={{ marginBottom: "5px" }}>
                    {service.name} - <strong>Qty:</strong> {service.qty} - <strong>Price:</strong> ₹{service.price}
                  </li>
                ))}
              </ul>

              <p style={{ margin: "5px 0" }}>
                <strong>Subtotal:</strong> ₹{order.subtotal} |{" "}
                <strong>Discount:</strong> ₹{order.discount} |{" "}
                <strong>Total:</strong> ₹{order.totalAmount}
              </p>

              <p style={{ margin: "5px 0" }}>
                <strong>Payment Mode:</strong> {order.paymentMode} |{" "}
                <strong>Status:</strong> {order.paymentStatus}
              </p>

              <p style={{ margin: "5px 0" }}>
                <strong>Order Status:</strong> {order.orderStatus}
              </p>

              <p style={{ margin: "5px 0" }}>
                <strong>Pickup:</strong>{" "}
                {order.pickupTime ? new Date(order.pickupTime).toLocaleString() : "-"} |{" "}
                <strong>Delivery:</strong>{" "}
                {order.deliveryTime ? new Date(order.deliveryTime).toLocaleString() : "-"}
              </p>

              <p style={{ margin: "5px 0" }}>
                <strong>Address:</strong> {order.address.line1}, {order.address.city} - {order.address.pincode}
              </p>

              {order.notes && (
                <p style={{ margin: "5px 0", color: "#555" }}>
                  <strong>Notes:</strong> {order.notes}
                </p>
              )}
              {order.adminRemarks && (
                <p style={{ margin: "5px 0", color: "#555" }}>
                  <strong>Admin Remarks:</strong> {order.adminRemarks}
                </p>
              )}

              {/* View Details Button */}
              <button
                onClick={() => navigate(`/order/${order._id}`)}
                style={{
                  marginTop: "10px",
                  padding: "10px 15px",
                  backgroundColor: "#007bff",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  transition: "0.3s",
                }}
                onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
                onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
              >
                View Details
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MyOrders;
