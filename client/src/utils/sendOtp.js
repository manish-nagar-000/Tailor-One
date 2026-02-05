import emailjs from "@emailjs/browser";

// 🔹 Send OTP via EmailJS
export const sendOtpEmail = (toEmail, otp) => {
  emailjs
    .send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,  // Service ID
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID, // Template ID
      {
        to_email: toEmail,
        otp_code: otp,
      },
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY   // Public Key
    )
    .then((res) => console.log("✅ OTP sent via EmailJS", res))
    .catch((err) => console.error("❌ EmailJS OTP sending failed", err));
};

// 🔹 Generate 6-digit OTP
export const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// 🔹 Save OTP + Email in sessionStorage
export const saveOtpToSession = (email, otp) => {
  sessionStorage.setItem("user_otp", otp);
  sessionStorage.setItem("user_email", email);
};

// 🔹 Verify OTP
export const verifyOtp = (email, otpInput) => {
  const savedOtp = sessionStorage.getItem("user_otp");
  const savedEmail = sessionStorage.getItem("user_email");

  if (!savedOtp || !savedEmail || savedEmail !== email) return false;
  return savedOtp === otpInput;
};

// 🔹 Clear OTP from sessionStorage
export const clearOtpSession = () => {
  sessionStorage.removeItem("user_otp");
  sessionStorage.removeItem("user_email");
};
