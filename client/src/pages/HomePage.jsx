import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

const WHATSAPP_NUMBER = "919034842803"; // change if needed

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cart, addItemToCart, updateQty, removeFromCart } = useContext(CartContext);
  const [services, setServices] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [userSubscriptions, setUserSubscriptions] = useState([]);
  const [success, setSuccess] = useState(false);
  const prevData = useRef([]);
  const navigate = useNavigate();

  const BASE_URL_SERVICES = "http://localhost:4000/api/services";
  const BASE_URL_SUBSCRIPTIONS = "http://localhost:4000/api/subscriptions";

  // Scroll animation for data-animate elements
  useEffect(() => {
    const elements = document.querySelectorAll("[data-animate]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.2 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => elements.forEach((el) => observer.unobserve(el));
  }, []);

  // Fetch services
  useEffect(() => {
    axios.get(BASE_URL_SERVICES)
      .then((res) => setServices(res.data))
      .catch((err) => console.error("Error fetching services:", err));
  }, []);

  // Fetch subscriptions & user subscriptions
  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const res = await axios.get(BASE_URL_SUBSCRIPTIONS);
        if (res.data.success) {
          setSubscriptions(res.data.subscriptions);
          prevData.current = res.data.subscriptions;
        }
      } catch (err) {
        console.error(err);
      }
    };

    const storedUserId = localStorage.getItem("userId");
    const storedToken = localStorage.getItem("token");

    const fetchUserSubs = async () => {
      if (storedUserId && storedToken) {
        try {
          const res = await axios.get(`${BASE_URL_SUBSCRIPTIONS}/user/${storedUserId}`, {
            headers: { Authorization: `Bearer ${storedToken}` },
          });
          if (res.data.success) setUserSubscriptions(res.data.subscriptions);
        } catch (err) {
          console.error(err);
        }
      }
    };

    fetchSubscriptions();
    fetchUserSubs();

    window.subscriptionInterval = setInterval(async () => {
      try {
        const res = await axios.get(BASE_URL_SUBSCRIPTIONS);
        const newData = res.data.subscriptions || [];
        const oldIds = prevData.current.map((s) => s._id);
        const newOnes = newData.filter((s) => !oldIds.includes(s._id));
        if (newOnes.length > 0 && "Notification" in window && Notification.permission === "granted") {
          newOnes.forEach((s) => {
            new Notification("📢 New Subscription Added!", {
              body: `${s.name} - ₹${s.price}`,
              icon: "/images/logo.png",
            });
          });
          setSubscriptions(newData);
          prevData.current = newData;
        }
      } catch (err) {
        console.error(err);
      }
    }, 15000);

    if ("Notification" in window) Notification.requestPermission();
    return () => clearInterval(window.subscriptionInterval);
  }, []);

  // Close mobile menu on resize > 768px
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const getQuantity = (id) => {
    const item = cart.find((i) => i.id === id);
    return item ? item.qty : 0;
  };

  const getServiceIcon = (name) => {
    const icons = {
      "Wash & Fold": "🧺",
      "Dry Cleaning": "🧼",
      "Eco Wash": "🌿",
      "Clothing Alterations": "✂️",
      "Custom Tailoring": "🧵",
      "Pickup & Delivery": "🚚",
    };
    return icons[name] || "👕";
  };

  const isInCart = (subId) => cart.some((item) => item.id === subId && item.type === "subscription");

  const handleAddSubscription = (sub) => {
    if (!isInCart(sub._id)) {
      addItemToCart({
        id: sub._id,
        name: sub.name,
        price: sub.price,
        type: "subscription",
        durationDays: sub.durationDays,
        clothLimit: sub.clothLimit,
      });
    }
  };

  const handleRemoveSubscription = (subId) => removeFromCart(subId, "subscription");

  // ---------------- WHATSAPP BOOKING FORM ----------------
  const handleSubmit = (e) => {
    e.preventDefault();

    // Get values from form inputs
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value || "N/A";
    const area = document.getElementById("area").value;
    const service = document.getElementById("service").value;
    const pickupTime = document.getElementById("pickup-time").value;
    const notes = document.getElementById("notes").value || "N/A";

    // WhatsApp base URL
    const baseURL = "https://api.whatsapp.com/send/?phone=919034842803&text=";

    // Create message
    const message = encodeURIComponent(
      `New TailorOne pickup request\n\n` +
      `Name: ${name}\n` +
      `Phone: ${phone}\n` +
      `Email: ${email}\n` +
      `Area: ${area}\n` +
      `Service: ${service}\n` +
      `Pickup time: ${pickupTime}\n` +
      `Notes: ${notes}`
    );

    // Full URL
    const finalURL = `${baseURL}${message}&type=phone_number&app_absent=0`;

    // Open WhatsApp
    window.open(finalURL, "_blank");

    // Show success message
    setSuccess(true);
    setTimeout(() => setSuccess(false), 5000);

    // Reset form
    e.target.reset();
  };

  const goToProfile = () => {
    navigate("/profile");
  };

  return (
    <>
      {/* ================== NAVBAR ================== */}
{/* ================== NAVBAR ================== */}
{/* ================== NAVBAR ================== */}
{/* ================== NAVBAR ================== */}
{/* ================= NAVBAR UNIVERSAL ================= */}
<header className="navbar-fixed">
  <div className="nav-container">

    {/* LOGO */}
    <a href="#top" className="logo">
      <img src="/images/logo.png" alt="TailorOne" className="logo-img" />
      <div>
        <div className="logo-main">TailorOne</div>
        <div className="logo-sub">24×7 Laundry & Ironing</div>
      </div>
    </a>

    {/* PROFILE ICON */}
    <div className="profile-icon" onClick={goToProfile}>👤</div>

    {/* HAMBURGER (Mobile Only) */}
    <button className={`nav-toggle ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(!menuOpen)}>
      <span></span>
      <span></span>
      <span></span>
    </button>

    {/* MENU */}
    <nav className={`nav-menu ${menuOpen ? "open" : ""}`}>
      <a href="#how">How it works</a>
      <a href="#pricing">Services & pricing</a>
      <a href="#why">Why TailorOne</a>
      <a href="#faq">FAQ</a>

      <a href="#contact" className="pickup-btn">Book pickup ↗</a>
    </nav>
  </div>
</header>




      {/* ================== HERO SECTION ================== */}
      {/* ... (Keep your existing HERO, HOW IT WORKS, SERVICES & SUBSCRIPTIONS, WHY, FAQ sections) ... */}

      
{/* ================== HERO SECTION ================== */}
<section className="hero" style={{ marginBottom: "6rem" }}>
  <div className="container hero-inner">
    <div className="hero-content" data-animate>
      <div className="hero-tag">
        <div className="hero-tag-pill">New in Gurugram</div>
        24-hour laundry & ironing at your doorstep
      </div>

      <h1 className="hero-heading">
        24-Hour <span className="hero-highlight">Laundry & Ironing</span>
        <br />
        for students & professionals.
      </h1>

      <p className="hero-subtitle">
        TailorOne picks up, cleans, irons and delivers your clothes within 24 hours in{" "}
        <strong>Gurugram (Vatika Chowk, Sector 49)</strong>. No more weekend laundry stress.
      </p>

      <div className="hero-meta">
        <div className="hero-meta-item"><span>⏱</span> 24-hour delivery promise</div>
        <div className="hero-meta-item"><span>📦</span> Doorstep pickup & drop</div>
        <div className="hero-meta-item"><span>🇮🇳</span> Built for Indian city life</div>
      </div>

      <div className="hero-ctas">
        <button
          className="btn btn-primary"
          onClick={() => {
            const contactSection = document.getElementById("contact");
            if (contactSection) {
              contactSection.scrollIntoView({ behavior: "smooth" });
            }
            // Optional: WhatsApp open
            // const baseURL = "https://api.whatsapp.com/send/?phone=919034842803&text=Hi, I want to book a pickup!";
            // window.open(baseURL, "_blank");
          }}
        >
          Book pickup now <span>→</span>
        </button>

        <button
          className="btn btn-secondary"
          onClick={() => {
            const pricingSection = document.getElementById("pricing");
            if (pricingSection) {
              pricingSection.scrollIntoView({ behavior: "smooth" });
            }
          }}
        >
          See services & pricing
        </button>
      </div>

      <p className="hero-note">
        <strong>Service areas:</strong> Vatika Chowk, Sector 49 & nearby sectors. Intro offers available.
      </p>
    </div>

    <div className="hero-visual" data-animate>
      <div className="hero-blob"></div>
      <div className="hero-machine">
        <div className="hero-machine-main">
          <div className="machine-title">Today’s pickup</div>
          <div className="machine-text">
            7 shirts • 3 trousers • 2 kurtas Express Wash & Iron
          </div>
          <div className="machine-status">
            <div className="machine-badge">🟢 In progress <span>✔</span></div>
            <div className="machine-pill">Delivery in 24 hrs</div>
          </div>
          <div className="machine-drum">
            <div className="machine-cloth">👕</div>
            <div className="machine-cloth">👖</div>
            <div className="machine-cloth">🧦</div>
          </div>
        </div>

        <div className="hero-machine-side">
          <div className="hero-pill-list">
            <div className="hero-pill-item">
              <span>📍</span><span className="hero-pill-label">Vatika Chowk, Sec 4 </span>
              <span className="hero-pill-value">Pickup 7:30 PM</span>
            </div>
            <div className="hero-pill-item">
              <span>⭐</span><span className="hero-pill-label">On-time deliveries</span>
              <span className="hero-pill-value">98%</span>
            </div>
          </div>

          <div className="hero-timeline">
            <div className="hero-timeline-dots">
              <div className="hero-dot"></div>
              <div className="hero-dot"></div>
              <div className="hero-dot"></div>
            </div>
            <div className="hero-timeline-labels">
              <div className="hero-timeline-main">Pickup → Clean → Iron</div>
              <div className="hero-timeline-sub"> → Delivery</div>
              <div className="hero-timeline-sub"> All within 24 hours. No</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

   
      {/* ================== HOW IT WORKS SECTION ================== */}
      <section id="how" style={{ marginTop: "8rem", marginBottom: "6rem" }}>
        <div className="container">
          <h2 className="section-heading">How TailorOne Works</h2>
          <p className="section-subtitle">
            Simple 4-step process — Book, Pickup, Wash & Deliver.
          </p>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-icon">📱</div>
              <h3 className="step-title">1. Book Your Pickup</h3>
              <p className="step-desc">Tell us your name, phone, area & pickup time.</p>
              <p className="step-meta">Takes less than 30 sec.</p>
            </div>

            <div className="step-card">
              <div className="step-icon">🚪</div>
              <h3 className="step-title">2. Doorstep Collection</h3>
              <p className="step-desc">Rider collects laundry from your room or gate.</p>
              <p className="step-meta">Weighing + tagging done.</p>
            </div>

            <div className="step-card">
              <div className="step-icon">🧺</div>
              <h3 className="step-title">3. Wash, Dry & Iron</h3>
              <p className="step-desc">Professional washing and premium ironing service.</p>
              <p className="step-meta">Fabric-wise care ensured.</p>
            </div>

            <div className="step-card">
              <div className="step-icon">🏠</div>
              <h3 className="step-title">4. Home Delivery</h3>
              <p className="step-desc">Within 24 hours, neatly packed & fresh.</p>
              <p className="step-meta">Cash/UPI available.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================== SERVICES & SUBSCRIPTIONS ================== */}
      <section id="pricing" style={{ marginBottom: "6rem" }}>
        <div className="container">
          <h2 className="section-heading">Our Services & Pricing</h2>
           <p className="section-subtitle">
            Transparent, pay-per-kg pricing. No hidden charges.
          </p>
          <div className="services-grid">
            {services.map((service) => (
              <div key={service._id} className="service-card">
                <div className="emoji">{getServiceIcon(service.name)}</div>
                <h3>{service.name}</h3>
                <p>{service.description || "Professional care for your garments."}</p>
                <p className="price">₹{service.price}</p>
                <div className="cart-buttons">
                  <button
                    className="remove-btn"
                    onClick={() => updateQty(service._id, getQuantity(service._id) - 1)}
                    disabled={getQuantity(service._id) === 0}
                  >-</button>
                  <span className="qty">{getQuantity(service._id)}</span>
                  <button
                    className="add-btn"
                    onClick={() => addItemToCart({ id: service._id, name: service.name, price: service.price })}
                  >+</button>
                </div>
              </div>
            ))}
          </div>

          {subscriptions.length > 0 && (
            <><br/>
            <br/>
            <br/>
            <br/>

              <h2 className="section-heading">Subscription Plans</h2>
               <p className="section-subtitle">
           Your Wardrobe Deserves the Best – Join Premium Today.
          </p>
              <div className="services-grid">
                {subscriptions.map((sub) => {
                  const userSub = userSubscriptions.find(
                    (us) => us.subscriptionId?._id === sub._id && us.status === "active"
                  );
                  const inCart = isInCart(sub._id);
                  return (
                    <div key={sub._id} className="service-card">
                      <div className="emoji">💳</div>
                      <h3>{sub.name}</h3>
                      <p>{sub.description || "Save with our subscription plans."}</p>
                      <p className="price">₹{sub.price}</p>
                      <p><strong>Duration:</strong> {sub.durationDays} days</p>
                      <p><strong>Cloth Limit:</strong> {sub.clothLimit} clothes</p>
                      {sub.benefits?.length > 0 && (
                        <ul>{sub.benefits.map((b, i) => <li key={i}>{b}</li>)}</ul>
                      )}
                      {userSub ? (
                        <div style={{ color: "#28a745", fontWeight: "bold" }}>
                          ✅ Active Subscription
                          <p>Cloth Used: {userSub.clothUsed} / {userSub.clothLimit}</p>
                          <p>Ends on: {userSub.expiryDate ? new Date(userSub.expiryDate).toLocaleDateString() : "N/A"}</p>
                        </div>
                      ) : inCart ? (
                        <button onClick={() => handleRemoveSubscription(sub._id)} className="btn btn-danger">Remove from Cart</button>
                      ) : (
                        <button onClick={() => handleAddSubscription(sub)} className="btn btn-primary">Add to Cart</button>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ================== WHY TAILORONE SECTION ================== */}
      <section id="why" style={{ marginTop: "6rem", marginBottom: "6rem" }}>
        <div className="container">
          <h2 className="section-heading">Why TailorOne?</h2>
          <p className="section-subtitle">
            Built for Indian city life – where time is short, wardrobes are busy, and clothes must always be ready.
          </p>

          <div className="why-grid">

            <div className="why-card">
              <div className="why-card-header">
                <div className="why-icon">⏰</div>
                <div className="why-title">24-hour delivery promise</div>
              </div>
              Most orders are picked up today and delivered by tomorrow, so your wardrobe never falls behind.
            </div>

            <div className="why-card">
              <div className="why-card-header">
                <div className="why-icon">🚪</div>
                <div className="why-title">Doorstep pickup & drop</div>
              </div>
              We come to your building, hostel, or PG. No need to walk to the local laundry and stand in queues.
            </div>

            <div className="why-card">
              <div className="why-card-header">
                <div className="why-icon">🧼</div>
                <div className="why-title">Professional care</div>
              </div>
              Partner laundries follow standard processes with fabric-wise sorting and temperature control.
            </div>

            <div className="why-card">
              <div className="why-card-header">
                <div className="why-icon">💸</div>
                <div className="why-title">Simple, transparent pricing</div>
              </div>
              Per-kg and per-piece pricing with no surprise charges. Special packages for hostels and families.
            </div>

            <div className="why-card">
              <div className="why-card-header">
                <div className="why-icon">📲</div>
                <div className="why-title">WhatsApp-first experience</div>
              </div>
              Optionally let customers book, reschedule, and track their orders via WhatsApp chat (future feature).
            </div>

            <div className="why-card">
              <div className="why-card-header">
                <div className="why-icon">📈</div>
                <div className="why-title">Built to scale across cities</div>
              </div>
              Asset-light model using local partners and riders, expandable from one cluster to multiple cities.
            </div>

          </div>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section id="faq" className="faq-wrapper">
        <h2 style={{textAlign:"center",marginBottom:"1rem"}}>Frequently Asked Questions</h2>

        <details>
          <summary>
            What areas do you currently serve?
            <span className="faq-icon">+</span>
          </summary>
          <p>We currently focus around Gurugram – Vatika Chowk, Sector 49 and nearby sectors/blocks.

</p>
        </details>

        <details>
          <summary>
            How fast is delivery?
            <span className="faq-icon">+</span>
          </summary>
          <p>Most orders are delivered within 24 hours of pickup. Express service (same-day delivery) is available on limited slots with an additional charge.</p>
        </details>

        <details>
          <summary>
            How do you charge for laundry?
            <span className="faq-icon">+</span>
          </summary>
          <p>For regular laundry, we usually charge per kg. For ironing and special garments, we charge per piece. You can freely change the prices and rules mentioned on this page.</p>
        </details>

        <details>
          <summary>
            Do you offer dry cleaning?
            <span className="faq-icon">+</span>
          </summary>
          <p>Yes, we support dry cleaning through partner facilities for items like blazers, suits, and delicate sarees. Pricing depends on the garment type and fabric.</p>
        </details>

        <details>
          <summary>
            How can I book a pickup?
            <span className="faq-icon">+</span>
          </summary>
          <p>You can book a pickup online through our website/app or via WhatsApp.</p>
        </details>

        <details>
          <summary>
            How do I pay?
            <span className="faq-icon">+</span>
          </summary>
          <p>You can accept UPI, cash, or wallet payments on delivery. As you grow, you can integrate payment gateways and show more options here (Razorpay, PhonePe, etc.).</p>
        </details>

      </section>



      {/* ================= CONTACT / BOOKING FORM ================= */}
      <section id="contact" className="contact-section">
        <div className="container contact-inner">
          <h2 className="contact-heading" data-animate>
            Book your pickup in 30 seconds.
          </h2>
          <p className="contact-subtitle" data-animate>
            Share your basic details and preferred time. We’ll confirm on call or WhatsApp before sending our rider.
          </p>

          <div className="contact-grid">
            {/* ---------- FORM ---------- */}
            <div data-animate>
              <form id="booking-form" onSubmit={handleSubmit} autoComplete="on">
                <div className="form-field">
                  <label htmlFor="name" className="form-label">Name*</label>
                  <input type="text" id="name" name="name" className="form-input" placeholder="Your full name" required />
                </div>
                <div className="form-field">
                  <label htmlFor="phone" className="form-label">Phone number*</label>
                  <input type="tel" id="phone" name="phone" className="form-input" placeholder="10-digit mobile number" required />
                </div>
                <div className="form-field">
                  <label htmlFor="email" className="form-label">Email (optional)</label>
                  <input type="email" id="email" name="email" className="form-input" placeholder="yourname@example.com" />
                </div>
                <div className="form-field form-full">
                  <label htmlFor="area" className="form-label">Area / Society*</label>
                  <input type="text" id="area" name="area" className="form-input" placeholder="e.g. Vatika Chowk, Sector 49, Gurugram" required />
                </div>
                <div className="form-field">
                  <label htmlFor="service" className="form-label">Service type*</label>
                  <select id="service" name="service" className="form-select form-input" required>
                    <option value="">Select a service</option>
                    <option>Wash &amp; Fold</option>
                    <option>Wash &amp; Iron</option>
                    <option>Only Ironing</option>
                    <option>Dry Cleaning</option>
                    <option>Express (Same-day)</option>
                  </select>
                </div>
                <div className="form-field">
                  <label htmlFor="pickup-time" className="form-label">Preferred pickup time*</label>
                  <input type="datetime-local" id="pickup-time" name="pickup-time" className="form-input" required />
                </div>
                <div className="form-field form-full">
                  <label htmlFor="notes" className="form-label">Any special notes? (optional)</label>
                  <textarea id="notes" name="notes" className="form-textarea" placeholder="e.g. delicate items, specific instructions, gate entry details"></textarea>
                </div>
                <div className="form-full">
                  <div className="contact-btn-row">
                    <button type="submit" className="btn-contact">Confirm pickup request <span>→</span></button>
                    <p className="contact-note">
                      You will receive a confirmation call or WhatsApp within a few minutes during working hours.
                    </p>
                  </div>
                  <p className={`contact-success ${success ? "visible" : ""}`} id="contact-success">
                    ✅ Thanks! Your request has been noted. This is a demo message – connect the form to your backend or Google Sheet later.
                  </p>
                </div>
              </form>
            </div>

            {/* ---------- CONTACT INFORMATION CARD ---------- */}
            <aside className="contact-meta-card" data-animate>
              <div>
                <h3>TailorOne – Gurugram cluster</h3>
                <p>
                  Serving <strong>Vatika Chowk, Sector 49</strong> and nearby sectors with 24-hour laundry &amp; ironing for
                  students, working professionals, and families.
                </p>
              </div>
              <ul className="contact-meta-list">
                <li><span>📍</span>Vatika Chowk, Sector 49 (and nearby) - Gurugram, Haryana</li>
                <li><span>📞</span>+91-90348-42803</li>
                <li><span>✉️</span>tailoronesuppor66@gmail.com</li>
              </ul>
            </aside>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer>
        <div className="footer-inner">
          <div>© 2025 TailorOne – tailorone.co.in. All rights reserved.</div>
          <div className="footer-links">
            <a href="#">Home</a>
            <a href="#faq">FAQ</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="footer-contact">
            <span>📞 +91 9034842803</span>
            <span>📍 Gurugram</span>
          </div>
          <div>Made for busy Indian city life.</div>
        </div>
      </footer>
    </>
  );
}
