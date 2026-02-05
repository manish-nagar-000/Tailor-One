// src/pages/ReturnPolicy.jsx
import React from "react";

const ReturnPolicy = () => {
  return (
    <div className="container mt-5 mb-5">
      <div className="text-center mb-4">
        <h2 className="fw-bold">Return & Refund Policy - TailorOne</h2>
        <hr className="w-25 mx-auto" />
      </div>

      <div className="policy-content">
        <p>
          At <strong>TailorOne</strong>, customer satisfaction is our top priority. 
          We strive to deliver the best quality tailoring, washing, dry-cleaning, 
          and ironing services. However, if there’s an issue with your order, 
          our return and refund policy ensures a smooth resolution.
        </p>

        <h4 className="mt-4 fw-semibold">1. Service Return / Rework Policy</h4>
        <p>
          Since we provide customized garment services, full returns are not always 
          possible. However, if you are unsatisfied with stitching, alteration, 
          or cleaning quality, you can raise a <strong>rework request</strong> 
          within <strong>24 hours</strong> of delivery.
        </p>
        <ul>
          <li>Pickup for rework will be arranged at your doorstep (if applicable).</li>
          <li>Minor alteration issues are fixed free of cost.</li>
          <li>For damage or loss claims, our quality team will verify the case.</li>
        </ul>

        <h4 className="mt-4 fw-semibold">2. Refund Policy</h4>
        <p>
          Refunds are applicable only in genuine cases where:
        </p>
        <ul>
          <li>The order was cancelled before pickup or processing.</li>
          <li>The service could not be completed due to internal issues.</li>
          <li>Approved by our customer support team after investigation.</li>
        </ul>
        <p>
          Refunds (if approved) are processed within <strong>5–7 business days</strong> 
          to your original payment method or wallet.
        </p>

        <h4 className="mt-4 fw-semibold">3. Non-Returnable Services</h4>
        <ul>
          <li>Used garments after delivery.</li>
          <li>Services completed as per customer-approved measurements.</li>
          <li>Customized tailoring or express delivery orders.</li>
        </ul>

        <h4 className="mt-4 fw-semibold">4. Cancellation Policy</h4>
        <p>
          Orders can be cancelled only before pickup or within <strong>30 minutes</strong> 
          of placing the order. Once the pickup is completed, cancellation is not allowed.
        </p>

        <h4 className="mt-4 fw-semibold">5. How to Raise a Return or Refund Request</h4>
        <p>
          You can contact our support team via:
        </p>
        <ul>
          <li>📞 <strong>Phone:</strong> <a href="tel:+919034842803">+91 9034842803</a></li>
          <li>💬 <strong>WhatsApp:</strong> Available on the TailorOne website</li>
        </ul>
        <p>
          Please include your <strong>Order ID</strong>, registered mobile number, 
          and a short description of the issue for faster resolution.
        </p>

        <h4 className="mt-4 fw-semibold">6. Policy Updates</h4>
        <p>
          TailorOne reserves the right to update or modify this policy anytime 
          to ensure fair and transparent service for all customers.
        </p>

        <p className="text-muted mt-4">
          <em>Last Updated: October 2025</em>
        </p>
      </div>
    </div>
  );
};

export default ReturnPolicy;
