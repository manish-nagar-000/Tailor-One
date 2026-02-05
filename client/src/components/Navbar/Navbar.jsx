import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; // ⭐ ADD useLocation
import { CartContext } from "../../context/CartContext";
import { AuthContext } from "../../context/AuthContext";
import { FaShoppingCart, FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation();  // ⭐ current URL detect
  if (location.pathname === "/") return null;  // ⭐ Home page par navbar hide

  const { cart } = useContext(CartContext);
  const { user, setUser } = useContext(AuthContext);
  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    const role = localStorage.getItem("userRole");
    if (email && role) setUser({ email, role });
  }, [setUser]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    setUser({ email: null, role: null });
    navigate("/login");
  };

  const handleProfileClick = () => {
    if (user?.role === "admin") navigate("/admin/dashboard");
    else navigate("/profile");
  };

  return (
    <>
      {/* 🌟 Desktop Slim Centered Navbar Wrapper */}
      <div className="navbar-wrapper">
        <nav className="navbar">

          {/* LOGO */}
          <div className="logo">
            <Link to="/"><img src="/images/logo.png" alt="T-One Logo" className="logo-image" /></Link>
            <Link to="/" className="nav-link logo-text">TailorOne</Link>

            {/* Mobile short-links */}
            <div className="nav-small-links">
              <Link to="/services" className="small-link">Services</Link>
              <span>|</span>
              <Link to="/subscription" className="small-link">Subscription</Link>
              {user?.email && (
                <>
                  <span>|</span>
                  <FaUserCircle size={20} title="Profile" onClick={handleProfileClick} />
                </>
              )}
            </div>
          </div>

          <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </div>

          <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
            <li><Link to="/" className="nav-link">Home</Link></li>
            <li><Link to="/services" className="nav-link">Services</Link></li>
            <li><Link to="/offers" className="nav-link">Offers</Link></li>
            <li><Link to="/subscription" className="nav-link">Subscription</Link></li>
            <li><Link to="/cart" className="nav-link"><FaShoppingCart /> Cart ({totalItems})</Link></li>

            {user?.email ? (
              <li className="profile-section">
                <FaUserCircle size={26} title="Profile" onClick={handleProfileClick} />
                <span onClick={handleLogout} className="logout">Logout</span>
              </li>
            ) : (
              <li><Link to="/login" className="login-btn">Login</Link></li>
            )}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
