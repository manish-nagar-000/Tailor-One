import React, { useEffect, useState } from "react";
import axios from "axios";

const OfferStatusAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // ✅ Fetch all orders
  const fetchOrders = async () => {
    if (!token) {
      setError("Unauthorized. Please login as admin.");
      setLoading(false);
      return;
    }
    try {
      const res = await axios.get("http://localhost:4000/api/orders/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setOrders(res.data.orders);
      else setError("Failed to fetch orders.");
    } catch (err) {
      console.error(err);
      setError("Error fetching orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ✅ Update order status
  const updateStatus = async (orderId, newStatus) => {
    try {
      const res = await axios.put(
        `http://localhost:4000/api/orders/update-status/${orderId}`,
        { orderStatus: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        alert(res.data.message);
        // Update local state
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? res.data.order : o))
        );
      } else {
        alert("Failed to update status");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating status");
    }
  };

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div>
      <h2>Update Order Status</h2>
      <div style={{ overflowX: "auto" }}>
        <table className="table table-bordered mt-3">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Tracking ID</th>
              <th>Customer Phone</th>
              <th>Services</th>
              <th>Total</th>
              <th>Payment Status</th>
              <th>Order Status</th>
              <th>Update Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <tr key={order._id}>
                <td>{idx + 1}</td>
                <td>{order.trackingId}</td>
                <td>{order.customerPhone}</td>
                <td>
                  {order.services.map((s) => (
                    <div key={s._id}>
                      {s.name} x {s.qty} = ₹{s.price * s.qty}
                    </div>
                  ))}
                </td>
                <td>₹{order.totalAmount.toFixed(2)}</td>
                <td>{order.paymentStatus}</td>
                <td>{order.orderStatus}</td>
                <td>
                  <select
                    className="form-select"
                    value={order.orderStatus}
                    onChange={(e) =>
                      updateStatus(order._id, e.target.value)
                    }
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OfferStatusAdmin;
