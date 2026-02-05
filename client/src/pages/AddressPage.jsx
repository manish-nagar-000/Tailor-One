// src/pages/AddAddress.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const AddAddress = () => {
  const [formData, setFormData] = useState({
    label: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  });

  const [addresses, setAddresses] = useState([]);

  // 🔹 Fetch saved addresses from backend
  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get("https://tailoronebackend.onrender.com/api/address", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAddresses(res.data);
    } catch (error) {
      console.error("❌ Error fetching addresses:", error);
    }
  };

  // 🔹 Save new address
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("❌ Please login first!");
        return;
      }

      const res = await axios.post(
        "http://localhost:4000/api/address",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status === 201) {
        alert("✅ Address saved successfully!");
        setFormData({
          label: "",
          addressLine: "",
          city: "",
          state: "",
          pincode: "",
          phone: "",
        });
        fetchAddresses(); // 🔄 refresh list instantly
      }
    } catch (err) {
      console.error("❌ Error saving address:", err);
      alert("Failed to save address");
    }
  };

  // Load all addresses on page load
  useEffect(() => {
    fetchAddresses();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Add New Address</h2>

      <input
        type="text"
        name="label"
        placeholder="Home / Office"
        value={formData.label}
        onChange={(e) => setFormData({ ...formData, label: e.target.value })}
        className="form-control mb-2"
      />

      <input
        type="text"
        name="addressLine"
        placeholder="Full Address"
        value={formData.addressLine}
        onChange={(e) =>
          setFormData({ ...formData, addressLine: e.target.value })
        }
        className="form-control mb-2"
      />

      <input
        type="text"
        name="city"
        placeholder="City"
        value={formData.city}
        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
        className="form-control mb-2"
      />

      <input
        type="text"
        name="state"
        placeholder="State"
        value={formData.state}
        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
        className="form-control mb-2"
      />

      <input
        type="text"
        name="pincode"
        placeholder="Pincode"
        value={formData.pincode}
        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
        className="form-control mb-2"
      />

      <input
        type="text"
        name="phone"
        placeholder="Phone"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        className="form-control mb-2"
      />

      <button onClick={handleSave} className="btn btn-primary mb-4">
        Save Address
      </button>

      <h3>Saved Addresses</h3>

      {addresses.length === 0 ? (
        <p>No saved addresses yet.</p>
      ) : (
        <div>
          {addresses.map((addr, index) => (
            <div
              key={index}
              className="card mb-3 p-3"
              style={{ borderRadius: "10px", border: "1px solid #ddd" }}
            >
              <h5>{addr.label || `Address ${index + 1}`}</h5>
              <p>{addr.addressLine}</p>
              <p>
                {addr.city}, {addr.state} - {addr.pincode}
              </p>
              <p>📞 {addr.phone}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddAddress;
