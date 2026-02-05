import React, { useEffect, useState } from "react";
import axios from "axios";
import "./OfferAdmin.css"; //  Custom CSS

const OfferAdmin = () => {
  const [offers, setOffers] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    code: "",
    discount: "",
    discountPercent: "",
    minAmount: "",
    description: "",
    validTill: "",
    active: true,
  });
  const [editingId, setEditingId] = useState(null);

  const fetchOffers = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/offers/");
      if (res.data.success) setOffers(res.data.offers);
    } catch (error) {
      console.error("Error fetching offers:", error);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: "",
      code: "",
      discount: "",
      discountPercent: "",
      minAmount: "",
      description: "",
      validTill: "",
      active: true,
    });
  };

  const handleAddOffer = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        discount: formData.discount ? Number(formData.discount) : null,
        discountPercent: formData.discountPercent ? Number(formData.discountPercent) : null,
        minAmount: Number(formData.minAmount) || 0,
        validTill: new Date(formData.validTill),
      };
      const res = editingId
        ? await axios.put(`http://localhost:4000/api/offers/${editingId}`, payload)
        : await axios.post("http://localhost:4000/api/offers/", payload);
      if (res.data.success) {
        alert(editingId ? "✅ Offer updated!" : "✅ Offer added!");
        resetForm();
        fetchOffers();
      } else alert(" Error: " + res.data.message);
    } catch (error) {
      alert(" Error: " + (error.response?.data?.message || error.message));
    }
  };

  const handleEdit = (offer) => {
    setEditingId(offer._id);
    setFormData({
      title: offer.title,
      code: offer.code,
      discount: offer.discount ?? "",
      discountPercent: offer.discountPercent ?? "",
      minAmount: offer.minAmount ?? "",
      description: offer.description ?? "",
      validTill: offer.validTill ? offer.validTill.split("T")[0] : "",
      active: offer.active,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this offer?")) return;
    try {
      const res = await axios.delete(`http://localhost:4000/api/offers/${id}`);
      if (res.data.success) {
        alert("🗑️ Offer deleted!");
        fetchOffers();
      }
    } catch (error) {
      alert(" Error deleting offer: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-6 px-4">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-6">
        <h2 className="text-3xl font-extrabold text-center text-purple-700 mb-6">
           Admin Offer Management
        </h2>

        {/* 🔹 Offer Form */}
        <form onSubmit={handleAddOffer} className="offer-form">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Offer Title" required />
            <input type="text" name="code" value={formData.code} onChange={handleChange} placeholder="Offer Code" required />
            <input type="number" name="discount" value={formData.discount} onChange={handleChange} placeholder="Discount (₹)" />
            <input type="number" name="discountPercent" value={formData.discountPercent} onChange={handleChange} placeholder="Discount (%)" />
            <input type="number" name="minAmount" value={formData.minAmount} onChange={handleChange} placeholder="Minimum Amount" />
            <input type="date" name="validTill" value={formData.validTill} onChange={handleChange} required />
            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="md:col-span-2" />
            <label className="flex items-center space-x-2 md:col-span-2">
              <input type="checkbox" name="active" checked={formData.active} onChange={handleChange} />
              <span>Active</span>
            </label>
          </div>
          <button type="submit" className={editingId ? "btn-yellow" : "btn-red"}>
            {editingId ? "Update Offer" : "Add Offer"}
          </button>
        </form>

        {/* 🔹 Offers Table */}
        <div className="overflow-x-auto rounded-lg shadow-md mt-6">
          <table className="offers-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Code</th>
                <th>₹</th>
                <th>%</th>
                <th>Min ₹</th>
                <th>Valid Till</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {offers.length > 0 ? (
                offers.map((offer) => (
                  <tr key={offer._id}>
                    <td>{offer.title}</td>
                    <td>{offer.code}</td>
                    <td>{offer.discount ?? "-"}</td>
                    <td>{offer.discountPercent ?? "-"}</td>
                    <td>{offer.minAmount}</td>
                    <td>{new Date(offer.validTill).toLocaleDateString()}</td>
                    <td>{offer.active ? "✅" : "❌"}</td>
                    <td className="actions">
                      <button className="btn-yellow" onClick={() => handleEdit(offer)}>Edit</button>
                      <button className="btn-red" onClick={() => handleDelete(offer._id)}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8">No offers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OfferAdmin;
