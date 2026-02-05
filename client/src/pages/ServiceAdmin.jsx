import React, { useEffect, useState } from "react";
import axios from "axios";

const ServiceAdmin = () => {
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
  });
  const [editId, setEditId] = useState(null);
  const BASE_URL = "http://localhost:4000/api/services";

  // 🟢 Fetch all services
  const fetchServices = async () => {
    try {
      const res = await axios.get(BASE_URL);
      setServices(res.data);
    } catch (error) {
      console.error("Error fetching services:", error);
      alert("Failed to fetch services");
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // ✍️ Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🟡 Add or Update service
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        // Update
        await axios.put(`${BASE_URL}/update/${editId}`, formData);
        alert("Service updated successfully!");
      } else {
        // Add
        await axios.post(`${BASE_URL}/add`, formData);
        alert("Service added successfully!");
      }

      setFormData({ name: "", description: "", price: "" });
      setEditId(null);
      fetchServices();
    } catch (error) {
      console.error("Error saving service:", error);
      alert("Failed to save service");
    }
  };

  // 🟠 Edit button click
  const handleEdit = (service) => {
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price,
    });
    setEditId(service._id);
  };

  // 🔴 Delete service
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    try {
      await axios.delete(`${BASE_URL}/delete/${id}`);
      alert("Service deleted successfully!");
      fetchServices();
    } catch (error) {
      console.error("Error deleting service:", error);
      alert("Failed to delete service");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">🧵 TailorOne - Service Admin Panel</h2>

      {/* Service Form */}
      <div className="card p-4 shadow mb-4">
        <h5>{editId ? "✏️ Edit Service" : "➕ Add New Service"}</h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Service Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter service name"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter service description"
              required
            ></textarea>
          </div>
          <div className="mb-3">
            <label className="form-label">Price (₹)</label>
            <input
              type="number"
              className="form-control"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter price"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            {editId ? "Update Service" : "Add Service"}
          </button>
        </form>
      </div>

      {/* Service List */}
      <div className="card p-4 shadow">
        <h5 className="mb-3">📋 All Services</h5>
        {services.length === 0 ? (
          <p>No services found.</p>
        ) : (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Service Name</th>
                <th>Description</th>
                <th>Price (₹)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service._id}>
                  <td>{service.name}</td>
                  <td>{service.description}</td>
                  <td>{service.price}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => handleEdit(service)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(service._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ServiceAdmin;
