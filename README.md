# 🛍️ Ecommerce Store — Full-Stack MERN Application

A full-featured e-commerce platform built with the MERN stack, featuring product catalog with search & filters, cart & wishlist, secure checkout with Razorpay payments, order tracking, and an admin dashboard — deployed live.

**🔗 Live Demo:** https://ecommerce-app-inky-eight.vercel.app/
**🔗 Backend API:** https://ecommerce-api-bnhe.onrender.com/api/health

> Note: Backend is hosted on Render's free tier, which spins down after inactivity — the first request may take up to 50 seconds to respond.

## Features

- **Authentication:** JWT-based register/login with role-based access (user/admin)
- **Product Catalog:** Search, category filters, pagination, image uploads via Cloudinary
- **Cart & Wishlist:** Persistent per-user cart with quantity management
- **Checkout & Payments:** Real payment integration with Razorpay, including signature verification for security
- **Order Management:** Order history for customers, full order management for admins
- **Email Notifications:** Automated order status emails via Brevo
- **Admin Dashboard:** View all orders, update order status, manage inventory

## Tech Stack

**Frontend:** React, React Router, Axios, React Hot Toast, Vite
**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcrypt
**Services:** Cloudinary (image hosting), Razorpay (payments), Brevo (transactional email)
**Deployment:** Vercel (frontend), Render (backend), MongoDB Atlas (database)

## Architecture

**client/** — React frontend (Vite)
- `src/api/` — Axios API call functions
- `src/components/` — Reusable UI components
- `src/context/` — Auth & Cart global state
- `src/pages/` — Route-level page components

**server/** — Express backend
- `controllers/` — Route logic
- `models/` — Mongoose schemas
- `routes/` — API endpoints
- `middleware/` — Auth & admin guards
- `services/` — Email service

## Key Implementation Details

- **Payment security:** Razorpay payments are verified server-side using HMAC SHA256 signature verification before an order is created — prevents client-side payment spoofing.
- **Order snapshotting:** Order line items store the product's name/price/image at time of purchase (not a live reference), so historical orders remain accurate even if product data changes later.
- **Cart sync:** Guest cart (localStorage) merges with the server-side cart on login.
- **Role-based middleware:** Admin-only routes protected both on the backend (Express middleware) and frontend (protected routes).

## Running Locally

**Backend:**
```bash
cd server
npm install
# Create a .env file with: MONGO_URI, JWT_SECRET, CLOUDINARY_*, RAZORPAY_*, BREVO_*
npm run dev
```

**Frontend:**
```bash
cd client
npm install
# Create a .env file with: VITE_API_URL=http://localhost:5000/api
npm run dev
```