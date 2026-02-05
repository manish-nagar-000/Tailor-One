// src/pages/PrivacyPolicy.jsx
import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="container mt-5 mb-5">
      <div className="text-center mb-4">
        <h2 className="fw-bold">Privacy Policy - TailorOne</h2>
        <hr className="w-25 mx-auto" />
      </div>

      <div className="policy-content">
        <p>
          At <strong>TailorOne</strong>, we value your trust and are committed to protecting
          your personal information. This Privacy Policy explains how we collect,
          use, and safeguard your data when you use our website and services.
        </p>

        <h4 className="mt-4 fw-semibold">1. Information We Collect</h4>
        <p>
          We may collect personal details such as your <strong>name, phone number, email address,
          pickup/delivery address</strong>, and order-related information when you use our
          services or register on our platform.
        </p>

        <h4 className="mt-4 fw-semibold">2. How We Use Your Information</h4>
        <p>
          Your information is used to:
        </p>
        <ul>
          <li>Process your orders and manage pickups/deliveries.</li>
          <li>Provide better customer support and service quality.</li>
          <li>Send you updates, notifications, or promotional offers.</li>
          <li>Improve our services and website experience.</li>
        </ul>

        <h4 className="mt-4 fw-semibold">3. Data Security</h4>
        <p>
          We use modern security measures to protect your data from unauthorized
          access, alteration, disclosure, or destruction. Your personal information
          is stored securely and accessed only by authorized personnel.
        </p>

        <h4 className="mt-4 fw-semibold">4. Sharing of Information</h4>
        <p>
          TailorOne <strong>does not sell, trade, or rent</strong> users’ personal identification
          information to others. We may share limited data only with trusted service
          partners who help us operate our business (e.g., delivery partners, payment
          gateways) — and only as necessary to fulfill your orders.
        </p>

        <h4 className="mt-4 fw-semibold">5. Cookies</h4>
        <p>
          Our website may use cookies to enhance user experience. You can choose to
          disable cookies in your browser, but some parts of the site may not function
          properly without them.
        </p>

        <h4 className="mt-4 fw-semibold">6. Your Rights</h4>
        <p>
          You can request access to, correction of, or deletion of your personal data
          anytime by contacting us at the email address provided below.
        </p>

        <h4 className="mt-4 fw-semibold">7. Policy Updates</h4>
        <p>
          We may update this Privacy Policy from time to time. Any changes will be
          reflected on this page with an updated “Last Updated” date.
        </p>

        <h4 className="mt-4 fw-semibold">8. Contact Us</h4>
        <p>
          If you have any questions or concerns about our Privacy Policy, please
          contact us at:
        </p>

        <div className="mt-3">
          <p>
            📞 <strong>Phone:</strong>{" "}
            <a href="tel:+919034842803">+91 9034842803</a> <br />
            🌐 <strong>Website:</strong>{" "}
            <a href="https://tailorone.co.in/" target="_blank" rel="noreferrer">
              www.tailorone.co.in
            </a>
          </p>
        </div>

        <p className="text-muted mt-4">
          <em>Last Updated: October 2025</em>
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
