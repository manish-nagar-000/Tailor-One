import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import CartFooterBar from "./components/CartFooterBar.jsx"; // ✅ Added for bottom cart bar

// Pages
import HomePage from "./pages/HomePage.jsx";
import ServicesPage from "./pages/ServicesPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import OffersPage from "./pages/OffersPage.jsx";
import SubscriptionPage from "./pages/SubscriptionPage.jsx";
import PaymentSuccess from "./pages/PaymentSuccess.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import VerifyOTP from "./pages/VerifyOTP.jsx";
import ForgetPassword from "./pages/ForgetPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import OrderPage from "./pages/OrderPage.jsx";
import Profile from "./pages/Profile.jsx";
import MyOrders from "./pages/MyOrders.jsx";
import AddressPage from "./pages/AddressPage.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import ReturnPolicy from "./pages/ReturnPolicy.jsx";
import OrderDetails from "./pages/OrderDetails.jsx";

// Admin
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminRoute from "./routes/AdminRoute.jsx";
import SubscriptionAdmin from "./pages/SubscriptionAdmin.jsx";
import OfferAdmin from "./pages/OfferAdmin.jsx";
import ServiceAdmin from "./pages/ServiceAdmin.jsx";
import SeeAllOrdersAdmin from "./pages/SeeAllOrdersAdmin.jsx";
import OfferStatusAdmin from "./pages/OfferStatusAdmin.jsx";

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {/* 🔹 Navbar only for user-side */}
      {!isAdminRoute && <Navbar />}

      {/* 🔹 All Routes */}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/offers" element={<OffersPage />} />
        <Route path="/subscription" element={<SubscriptionPage />} />
        <Route path="/paymentsuccess" element={<PaymentSuccess />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/order" element={<OrderPage />} />

        {/* Order Details */}
        <Route path="/order/:orderId" element={<OrderDetails />} />

        {/* Profile / Customer */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/address" element={<AddressPage />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/return-policy" element={<ReturnPolicy />} />

        {/* Admin */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        >
          <Route path="subscription" element={<SubscriptionAdmin />} />
          <Route path="offers" element={<OfferAdmin />} />
          <Route path="service" element={<ServiceAdmin />} />
          <Route path="all-Orders" element={<SeeAllOrdersAdmin />} />
          <Route path="offer-status" element={<OfferStatusAdmin />} />
        </Route>
      </Routes>

      {/* ✅ Bottom fixed Cart Footer (visible on user routes only) */}
      {!isAdminRoute && <CartFooterBar />}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
