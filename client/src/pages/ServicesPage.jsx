import React, { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import "./ServicesPage.css";

const ServicesPage = () => {
  const { cart, addItemToCart, updateQty } = useContext(CartContext);
  const [services, setServices] = useState([]);
  const [userInteracted, setUserInteracted] = useState(false);
  const notificationCount = useRef(0);

  const BASE_URL = "http://localhost:4000/api/services";

  // 🟩 Fetch services
  const fetchServices = async (isCheck = false) => {
    try {
      const res = await axios.get(BASE_URL);
      const data = res.data;

      if (isCheck && services.length > 0) {
        const oldIds = services.map((s) => s._id);
        const newServices = data.filter((s) => !oldIds.includes(s._id));

        if (newServices.length > 0 && notificationCount.current < 2) {
          // 🔔 Show popup
          newServices.forEach((s) => {
            if (Notification.permission === "granted") {
              new Notification("🧺 New Service Added!", {
                body: `${s.name} - ₹${s.price}`,
                icon: "/logo192.png",
              });
            }
          });

          // 🔊 Play sound only if user interacted
          if (userInteracted) {
            const audio = new Audio("/new-service.mp3");
            audio.play();
            setTimeout(() => audio.play(), 1000);
          } else {
            console.warn("⚠️ Sound blocked until user clicks page.");
          }

          notificationCount.current += 1;
          setServices(data);

          //  Stop after 2 notifications
          if (notificationCount.current >= 2) {
            clearInterval(window.serviceInterval);
          }
        }
      } else {
        setServices(data);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  // 🟩 Initial setup
  useEffect(() => {
    Notification.requestPermission();

    fetchServices();

    //  Poll every 15 sec
    window.serviceInterval = setInterval(() => fetchServices(true), 15000);

    // 🧹 Cleanup
    return () => clearInterval(window.serviceInterval);
  }, []);

  //  Detect user click to enable sound
  useEffect(() => {
    const handleClick = () => setUserInteracted(true);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  // 🟩 Get quantity of each service in cart
  const getQuantity = (serviceId) => {
    const item = cart.find((i) => i.id === serviceId);
    return item ? item.qty : 0;
  };

  return (
    <div className="services-wrapper" style={{ marginBottom: "50px" }}>
      <h1>👕 Clothes Services</h1>
      <p style={{ textAlign: "center", color: "gray" }}>
        (Stay tuned — you’ll be notified if new services are added!)
      </p>
      <div className="services-grid">
        {services.map((service) => (
          <div key={service._id} className="service-card">
            <div className="service-info">
              <h3 className="service-name">{service.name}</h3>
              <p className="service-price">₹{service.price}</p>
            </div>

            <div className="action-buttons">
              {/*  Decrease Quantity */}
              <button
                className="btn-remove"
                onClick={() =>
                  updateQty(service._id, getQuantity(service._id) - 1)
                }
                disabled={getQuantity(service._id) === 0}
                style={{
                  opacity: getQuantity(service._id) === 0 ? 0.6 : 1,
                  cursor:
                    getQuantity(service._id) === 0 ? "not-allowed" : "pointer",
                }}
              >
                -
              </button>

              {/*  Quantity Badge */}
              {getQuantity(service._id) > 0 && (
                <span className="qty-badge">{getQuantity(service._id)}</span>
              )}

              {/*  Increase Quantity */}
              <button
                className="btn-add"
                onClick={() =>
                  addItemToCart({
                    id: service._id,
                    name: service.name,
                    price: service.price,
                  })
                }
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesPage;
