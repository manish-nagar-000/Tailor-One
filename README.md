git init
git clone https://github.com/manish-nagar-000/Tailor-One.git

cd client
npm intall
npm run dev

cd.. 
cd server
npm install
npm start



# 🧵 Tailor-One – On-Demand Tailoring & Laundry Service

Tailor-One is a full-stack MERN web application that allows users to request tailoring, washing, dry cleaning, and ironing services online.  
The project is built to demonstrate real-world service booking, admin management, and backend API handling.

---

---

## 🛠️ Tech Stack

**Frontend**
- React.js
- HTML, CSS
- Axios

**Backend**
- Node.js
- Express.js
- MongoDB (MongoDB Atlas)

**Deployment**
- Backend: Render
- Database: MongoDB Atlas

---

## ✨ Features

### 👤 User Features
- Call Me Back / Pickup Request Form
- Service Information (Tailoring, Washing, Dry Cleaning, Ironing) , subscription , offers
- Responsive UI (Mobile + Desktop)
- Direct WhatsApp & Call Button

### 🛠️ Admin Features
- Admin Login
- View all pickup/service requests
- Update request status (Pending / Confirmed / Completed)
- Basic payment tracking
- add , remove , delete , update all services and offers and subscriptions
---

## 📂 Project Structure

Tailor-One/
│
├── client/ # React Frontend
│
├── server/ # Node.js Backend
│ ├── index.js
│ ├── package.json
│ ├── routes/
│ ├── controllers/
│ └── models/
│
└── README.md


very important - add .env file in server file 
PORT=4000

DB_URI=your_mongodb_connection_string

KEY_ID=your_razorpay_key_id
KEY_SECRET=your_razorpay_key_secret

ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password

BREVO_SMTP_KEY=your_brevo_smtp_key
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USERNAME=your_smtp_username
SMTP_PASSWORD=your_smtp_password


> ⚠️ `.env` file is not committed to GitHub for security reasons.

---

## 🧪 How to Run Locally

```bash
# Backend
cd server
npm install
npm start

# Frontend
cd client
npm install
npm run dev
