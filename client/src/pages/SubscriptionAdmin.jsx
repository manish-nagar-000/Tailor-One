// src/pages/SubscriptionAdmin.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const SubscriptionAdmin = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [newSub, setNewSub] = useState({
    name: "",
    price: "",
    durationDays: "",
    benefits: "",
    clothLimit: "",
  });
  const [loading, setLoading] = useState(false);
  const API_BASE = "http://localhost:4000/api/subscriptions";

  // Fetch all subscriptions
  const fetchSubscriptions = async () => {
    try {
      const res = await axios.get(API_BASE);
      setSubscriptions(res.data.subscriptions || []);
    } catch (err) {
      console.error("Error fetching subscriptions:", err);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  // Add a new subscription
  const handleAddSubscription = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const benefitsArray = newSub.benefits
        ? newSub.benefits.split(",").map((b) => b.trim())
        : [];
      await axios.post(API_BASE, {
        ...newSub,
        price: Number(newSub.price),
        durationDays: Number(newSub.durationDays),
        clothLimit: Number(newSub.clothLimit),
        benefits: benefitsArray,
        active: true,
      });
      alert("Subscription added successfully!");
      setNewSub({
        name: "",
        price: "",
        durationDays: "",
        benefits: "",
        clothLimit: "",
      });
      fetchSubscriptions();
    } catch (err) {
      console.error("Error adding subscription:", err);
      alert("Failed to add subscription");
    } finally {
      setLoading(false);
    }
  };

  // Update subscription
  const handleUpdateSubscription = async (id) => {
    const price = prompt("Enter new price:");
    const duration = prompt("Enter new duration (days):");
    if (!price || !duration) return;
    try {
      await axios.put(`${API_BASE}/${id}`, {
        price: Number(price),
        durationDays: Number(duration),
      });
      alert("Subscription updated successfully!");
      fetchSubscriptions();
    } catch (err) {
      console.error("Error updating subscription:", err);
      alert("Failed to update subscription");
    }
  };

  // Delete subscription
  const handleDeleteSubscription = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subscription?")) return;
    try {
      await axios.delete(`${API_BASE}/${id}`);
      alert("Subscription deleted successfully!");
      fetchSubscriptions();
    } catch (err) {
      console.error("Error deleting subscription:", err);
      alert("Failed to delete subscription");
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "1200px",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          fontSize: "1.8rem",
          marginBottom: "20px",
          color: "#333",
        }}
      >
        📦 Subscription Management
      </h2>

      {/* Add new subscription form */}
      <form
        onSubmit={handleAddSubscription}
        style={{
          marginTop: "10px",
          marginBottom: "30px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "12px",
          background: "#f8f9fa",
          padding: "15px",
          borderRadius: "10px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        }}
      >
        <input
          type="text"
          placeholder="Name"
          value={newSub.name}
          onChange={(e) => setNewSub({ ...newSub, name: e.target.value })}
          required
          style={{
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />
        <input
          type="number"
          placeholder="Price (₹)"
          value={newSub.price}
          onChange={(e) => setNewSub({ ...newSub, price: e.target.value })}
          required
          style={{
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />
        <input
          type="number"
          placeholder="Duration (Days)"
          value={newSub.durationDays}
          onChange={(e) =>
            setNewSub({ ...newSub, durationDays: e.target.value })
          }
          required
          style={{
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />
        <input
          type="number"
          placeholder="Cloth Limit"
          value={newSub.clothLimit}
          onChange={(e) =>
            setNewSub({ ...newSub, clothLimit: e.target.value })
          }
          required
          style={{
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />
        <input
          type="text"
          placeholder="Benefits (comma separated)"
          value={newSub.benefits}
          onChange={(e) => setNewSub({ ...newSub, benefits: e.target.value })}
          style={{
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "10px 15px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {loading ? "Adding..." : "Add Subscription"}
        </button>
      </form>

      {/* Responsive Subscription List */}
      <div
        style={{
          overflowX: "auto",
          borderRadius: "10px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          background: "white",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            minWidth: "600px",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#343a40", color: "white" }}>
              <th style={{ padding: "10px" }}>Name</th>
              <th>Price</th>
              <th>Duration (Days)</th>
              <th>Cloth Limit</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    color: "#555",
                  }}
                >
                  No subscriptions found
                </td>
              </tr>
            ) : (
              subscriptions.map((sub) => (
                <tr
                  key={sub._id}
                  style={{
                    borderBottom: "1px solid #ddd",
                    textAlign: "center",
                  }}
                >
                  <td style={{ padding: "10px" }}>{sub.name}</td>
                  <td>₹{sub.price}</td>
                  <td>{sub.durationDays}</td>
                  <td>{sub.clothLimit}</td>
                  <td>
                    <span
                      style={{
                        color: sub.active ? "green" : "red",
                        fontWeight: "bold",
                      }}
                    >
                      {sub.active ? "Active" : "Expired"}
                    </span>
                  </td>
                  <td style={{ padding: "8px" }}>
                    <button
                      onClick={() => handleUpdateSubscription(sub._id)}
                      style={{
                        backgroundColor: "#ffc107",
                        color: "white",
                        border: "none",
                        padding: "6px 10px",
                        borderRadius: "5px",
                        cursor: "pointer",
                        marginRight: "5px",
                      }}
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDeleteSubscription(sub._id)}
                      style={{
                        backgroundColor: "#dc3545",
                        color: "white",
                        border: "none",
                        padding: "6px 10px",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile view tip */}
      <p
        style={{
          fontSize: "0.85rem",
          textAlign: "center",
          color: "#777",
          marginTop: "10px",
        }}
      >
        📱 Tip: You can scroll horizontally to view the table on small screens.
      </p>
    </div>
  );
};

export default SubscriptionAdmin;
