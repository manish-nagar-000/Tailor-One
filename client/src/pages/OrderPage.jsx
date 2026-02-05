import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OrderPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [address, setAddress] = useState({
    houseNo: "",
    street: "",
    landmark: "",
    line1: "",
    city: "",
    pincode: "",
  });
  const [contactNumber, setContactNumber] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [offer, setOffer] = useState(null);
  const [finalAmount, setFinalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [locationCoords, setLocationCoords] = useState(null);
  const [paymentMode, setPaymentMode] = useState("Razorpay");
  const [deliveryWithin, setDeliveryWithin] = useState("24 hours");

  const token = localStorage.getItem("token");
  const user = token ? JSON.parse(atob(token.split(".")[1])) : null;

  // Load cart & offer
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const appliedOffer = JSON.parse(localStorage.getItem("appliedOffer"));
    if (storedCart.length === 0) navigate("/cart");
    setCart(storedCart);
    if (appliedOffer) setOffer(appliedOffer);
  }, [navigate, token]);

  // Calculate final amount
  useEffect(() => {
    const multiplier = deliveryWithin === "12 hours" ? 1.5 : 1;
    let total = 0;

    cart.forEach((item) => {
      let itemPrice = item.price * multiplier;
      if (offer) {
        if (offer.discount) itemPrice -= offer.discount / cart.length;
        else if (offer.discountPercent)
          itemPrice -= (itemPrice * offer.discountPercent) / 100;
      }
      total += itemPrice * item.qty;
    });

    setFinalAmount(Math.max(total, 0));
  }, [cart, offer, deliveryWithin]);

  const reverseGeocode = async (latitude, longitude) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
      );
      const data = await res.json();
      const road =
        data.address.road ||
        data.address.neighbourhood ||
        data.address.suburb ||
        "";
      const city =
        data.address.city || data.address.town || data.address.village || "";
      const pincode = data.address.postcode || "";

      setAddress((prev) => ({
        ...prev,
        street: road,
        line1: `${road}, ${city}`.trim(),
        city,
        pincode,
      }));
    } catch (err) {
      console.warn("Reverse geocode failed:", err);
      alert("⚠️ Unable to fetch address details.");
    }
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      alert("⚠️ Your browser does not support location detection.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocationCoords({ lat: latitude, lng: longitude });
        reverseGeocode(latitude, longitude);
      },
      (err) => {
        if (err.code === 1) {
          alert("⚠️ Please allow location access to auto-fill your address.");
        } else if (err.code === 2) {
          alert("⚠️ Please turn ON your device location and refresh the page.");
        } else {
          alert("⚠️ Unable to detect your location. Try again.");
        }
        console.warn("Location access denied:", err.message);
      }
    );
  }, []);

  const detectMyLocation = () => {
    if (!navigator.geolocation) {
      alert("⚠️ Geolocation not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocationCoords({ lat: latitude, lng: longitude });
        reverseGeocode(latitude, longitude);
      },
      (err) => {
        alert("⚠️ Location access denied: " + err.message);
      }
    );
  };

  const handleOrder = async () => {
    if (
      !address.houseNo ||
      !address.street ||
      !address.line1 ||
      !address.city ||
      !address.pincode ||
      !pickupTime ||
      !contactNumber
    ) {
      alert("⚠️ Please fill all required address details!");
      return;
    }

    try {
      setLoading(true);
      const multiplier = deliveryWithin === "12 hours" ? 1.5 : 1;

      const servicesForOrder = cart.map((item) => {
        let price = item.price * multiplier;
        if (offer) {
          if (offer.discount) price -= offer.discount / cart.length;
          else if (offer.discountPercent)
            price -= (price * offer.discountPercent) / 100;
        }
        return {
          name: item.name,
          qty: item.qty,
          price: parseFloat(price.toFixed(2)),
        };
      });

      const totalAmount = servicesForOrder.reduce(
        (acc, item) => acc + item.price * item.qty,
        0
      );

      const note =
        deliveryWithin === "12 hours"
          ? "⚡ Fast delivery selected: Price increased due to 12 hours delivery, your order will arrive within 12 hours."
          : "";

      const orderRes = await axios.post(
        "http://localhost:4000/api/orders/create",
        {
          services: servicesForOrder,
          address,
          subtotal: cart.reduce((acc, item) => acc + item.price * item.qty, 0),
          offerCode: offer?.code || null,
          discount: offer
            ? cart.reduce(
                (acc, item) =>
                  acc +
                  (item.price * multiplier -
                    servicesForOrder.find((i) => i.name === item.name).price),
                0
              )
            : 0,
          totalAmount,
          paymentMode,
          deliveryWithin,
          notes: note,
          pickupTime: new Date(pickupTime),
          customerPhone: contactNumber,
          location: locationCoords,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { order } = orderRes.data;

      if (paymentMode === "COD") {
        alert("✅ Order placed successfully! Pay cash on delivery.");
        localStorage.removeItem("cart");
        localStorage.removeItem("appliedOffer");
        navigate("/");
        return;
      }

      const keyRes = await axios.get(
        "http://localhost:4000/api/getkey"
      );
      const { keyId } = keyRes.data;

      const options = {
        key: keyId,
        amount: totalAmount * 100,
        currency: "INR",
        name: "TailorOne",
        description: "TailorOne Service Payment",
        order_id: order.razorpayOrderId,
        handler: async function (response) {
          await axios.put(
            "http://localhost:4000/api/orders/update-payment",
            {
              orderId: order._id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
              paymentStatus: "Paid",
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          alert("✅ Payment successful!");
          localStorage.removeItem("cart");
          localStorage.removeItem("appliedOffer");
          navigate("/");
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: contactNumber,
        },
        theme: { color: "#1d4ed8" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("❌ Something went wrong! Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">🧾 Confirm Your Order</h2>

      <div className="card p-4 shadow-sm">
        <h5>🪡 Items Summary</h5>
        {cart.map((item, idx) => {
          const multiplier = deliveryWithin === "12 hours" ? 1.5 : 1;
          let itemPrice = item.price * multiplier;
          if (offer) {
            if (offer.discount) itemPrice -= offer.discount / cart.length;
            else if (offer.discountPercent)
              itemPrice -= (itemPrice * offer.discountPercent) / 100;
          }
          return (
            <p key={idx}>
              {item.name} × {item.qty} = ₹{(itemPrice * item.qty).toFixed(2)}
            </p>
          );
        })}

        {deliveryWithin === "12 hours" && (
          <p style={{ color: "red", fontWeight: "bold" }}>
            ⚡ Fast delivery selected: Price increased due to 12 hours delivery,
            your order will arrive within 12 hours.
          </p>
        )}

        <hr />
        <h3>Total Payable: ₹{finalAmount.toFixed(2)}</h3>

        <div className="form-group mt-3">
          <label>💳 Payment Mode</label>
          <select
            className="form-control"
            value={paymentMode}
            onChange={(e) => setPaymentMode(e.target.value)}
          >
            <option value="Razorpay">Razorpay (Online)</option>
            <option value="COD">Cash on Delivery</option>
          </select>
        </div>

        <div className="form-group mt-3">
          <label>⏱️ Delivery Within</label>
          <select
            className="form-control"
            value={deliveryWithin}
            onChange={(e) => setDeliveryWithin(e.target.value)}
          >
            <option value="12 hours">12 hours</option>
            <option value="24 hours">24 hours</option>
          </select>
        </div>

        {/* Address Section */}
        <div className="form-group mt-3">
          <label>🏠 House / Flat / Room No.</label>
          <input
            type="text"
            className="form-control"
            value={address.houseNo}
            onChange={(e) =>
              setAddress({ ...address, houseNo: e.target.value })
            }
          />
        </div>

        <div className="form-group mt-3">
          <label>🛣️ Street / Colony</label>
          <input
            type="text"
            className="form-control"
            value={address.street}
            onChange={(e) =>
              setAddress({ ...address, street: e.target.value })
            }
          />
        </div>

        <div className="form-group mt-3">
          <label>📍 Landmark (optional)</label>
          <input
            type="text"
            className="form-control"
            value={address.landmark}
            onChange={(e) =>
              setAddress({ ...address, landmark: e.target.value })
            }
          />
        </div>

        <div className="mt-3">
          <label>📍 Auto-detected Location</label>
          <input
            type="text"
            className="form-control mt-2"
            placeholder="Your address will appear here..."
            value={address.line1}
            onChange={(e) => setAddress({ ...address, line1: e.target.value })}
          />
          <button
            className="btn btn-outline-primary mt-2"
            type="button"
            onClick={detectMyLocation}
          >
            🔁 Detect Again
          </button>
        </div>

        <div className="form-group mt-3">
          <label>🏙️ City</label>
          <input
            type="text"
            className="form-control"
            value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
          />
        </div>

        <div className="form-group mt-3">
          <label>📮 Pincode</label>
          <input
            type="text"
            className="form-control"
            value={address.pincode}
            onChange={(e) =>
              setAddress({ ...address, pincode: e.target.value })
            }
          />
        </div>

        <div className="form-group mt-3">
          <label>📞 Contact Number</label>
          <input
            type="text"
            className="form-control"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
          />
        </div>

        <div className="form-group mt-3">
          <label>🕒 Pickup Time</label>
          <input
            type="datetime-local"
            className="form-control"
            value={pickupTime}
            onChange={(e) => setPickupTime(e.target.value)}
          />
        </div>

        <button
          className="btn btn-primary w-100 mt-4"
          onClick={handleOrder}
          disabled={loading}
        >
          {loading
            ? "Processing..."
            : `Place Order ₹${finalAmount.toFixed(2)}`}
        </button>

        {/* 🟦 Bottom Space */}
        <div style={{ height: "80px" }}></div>
      </div>
    </div>
  );
};

export default OrderPage;
