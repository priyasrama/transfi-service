# 💳 Mini Payment Gateway API — MERN Stack

A secure, simplified payment gateway system built using the **MERN stack** (MongoDB, Express, React, Node.js).  
Implements **JWT authentication**, **merchant onboarding**, **HMAC request signing**, **secure transaction APIs**, and a **React dashboard** for analytics.

---

## 🚀 Features

### 🧠 Backend (Node.js + Express)
- Secure user authentication (JWT + refresh token)
- Merchant management (API key + encrypted secret)
- HMAC-SHA256 signature verification
- Mock payment processing with transaction history
- Webhook endpoint for payment updates
- Security best practices implemented (rate limit, XSS, sanitization, etc.)

### 💻 Frontend (React)
- Login / Register flow
- Merchant dashboard (API key view, analytics, transactions)
- Demo checkout page
- Responsive and user-friendly UI (Material UI + Recharts)

---

## 🧩 Tech Stack

**Backend:** Node.js, Express.js, MongoDB, Mongoose  
**Frontend:** React.js, Axios, React Router, Recharts  
**Security:** Helmet, express-rate-limit, express-mongo-sanitize, CORS, AES Encryption (CryptoJS)  
**Testing:** Jest + Supertest  
**Documentation:** Swagger / Postman Collection  

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repo
```bash
git clone https://github.com/<your-username>/transfi-payment-gateway.git
cd transfi-payment-gateway

##SetUp Backend

cd backend
npm install
cp .env.example .env
npm run dev


#Setup Frontend

cd ../frontend
npm install
npm start


