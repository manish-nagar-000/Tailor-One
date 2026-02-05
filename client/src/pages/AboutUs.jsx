// src/pages/AboutUs.jsx
import React from "react";

const AboutUs = () => {
  return (
    <div className="container mt-5 mb-5">
      <div className="text-center mb-4">
        <h2 className="fw-bold">About Us - TailorOne</h2>
        <hr className="w-25 mx-auto" />
      </div>

      <div className="row align-items-center">
        <div className="col-md-6">
          <img
            src="/images/q1.jpeg"
            alt="TailorOne Services"
            className="img-fluid rounded shadow"
          />
        </div>

        <div className="col-md-6">
          <h4 className="fw-semibold">Welcome to TailorOne 👕</h4>
          <p>
            TailorOne is your one-stop destination for <strong>Tailoring, Washing, Dry Cleaning,</strong> 
            and <strong>Ironing</strong> services. Our goal is to bring professional garment care 
            right to your doorstep — so you can look your best without any hassle.
          </p>

          <p>
            With years of experience and skilled professionals, we ensure 
            <strong> premium quality, quick turnaround,</strong> and <strong>customer satisfaction.</strong>  
            Every cloth we handle receives the care and precision it deserves.
          </p>

          <h5 className="mt-4 fw-bold">Our Mission 🎯</h5>
          <p>
            To make clothing care convenient, affordable, and accessible to everyone 
            through technology, doorstep pickup, and trusted local professionals.
          </p>

          <h5 className="mt-4 fw-bold">Our Vision 🌟</h5>
          <p>
            To become India’s most reliable on-demand tailoring and laundry platform, 
            combining tradition with innovation.
          </p>

          <div className="mt-4">
            <h5 className="fw-bold">📞 Contact Us</h5>
            <p>
              Phone: <a href="tel:+919034842803">+91 9034842803</a><br />
              Location: Available across multiple cities in India.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
