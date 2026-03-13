# 🖨️ PrintNest — Modern Print-on-Demand E-Commerce Store

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.2.3-blue?logo=react)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://typescriptlang.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-green?logo=mongodb)](https://mongoosejs.com)
[![Express](https://img.shields.io/badge/Express-4.x-lightgrey?logo=express)](https://expressjs.com)
[![Stripe](https://img.shields.io/badge/Stripe-Payment-blue?logo=stripe)](https://stripe.com)
[![PayPal](https://img.shields.io/badge/PayPal-Payment-blue?logo=paypal)](https://paypal.com)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.11-purple?logo=redux)](https://redux-toolkit.js.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-cyan?logo=tailwindcss)](https://tailwindcss.com)

A professional, full-stack monorepo e-commerce platform for custom print-on-demand products. Built with a **Next.js 16** frontend and a dedicated **Express.js** backend, integrated with Stripe/PayPal, multimodal AI, comprehensive inventory and warehouse management, and advanced security features.

---

## ✨ Key Features

### 🛒 Industrial E-Commerce
- **Multi-Gateway Checkout**: Secure payments via **Stripe** and **PayPal Express**.
- **Advanced Inventory**: Multi-warehouse stock tracking with low-stock thresholds.
- **Smart Catalog**: Quick view, side-by-side comparison, and persistent wishlist.
- **Order Lifecycle**: Real-time order tracking with status history and automated email updates.
- **Review Ecosystem**: Verified purchase reviews with star ratings and moderation tools.

### 🔐 Advanced Security & Auth
- **OTP Verification**: Secure email verification during signup using Brevo-powered OTPs.
- **Password Recovery**: Secure, JWT-signed forgot/reset password flow.
- **Multi-Level RBAC**: Support for `super_admin`, `admin`, and standard users.
- **Hardened Server**: Backend protected by **Helmet**, **Rate Limiting**, **CORS**, and **HTTP-only Cookies**.
- **Audit Trail**: Detailed activity logging of all administrative actions for transparency.

### 🛠️ High-Performance Admin Panel (`/admin`)
- **Warehouse Management**: CRUD operations for warehouses and bulk inventory assignment.
- **Live Analytics**: Interactive charts for revenue trends, order velocity, and top-performing products.
- **Content Manager**: Dynamic category management and product catalog control.
- **Log Viewer**: Searchable audit logs for all administrative actions (Super Admin only).
- **AI Tooling**: Multimodal description generation using Llama 4 Scout and Llama 3.3.

### 🤖 Multimodal AI Integration
- **Llama 4 Scout (17B)**: Analyzes product images to generate visual-first, SEO-optimized descriptions.
- **Llama 3.3 (70B)**: High-parameter semantic text generator for conversion-focused copy.
- **SEO Ready**: Automatically incorporates LSI keywords based on visual product attributes.

### 📧 Scalable Communication
- **Brevo SMTP API**: High-deliverability transactional emails (OTPs, Welcome, Orders).
- **Automated Tracking**: Instant email notifications for order confirmation and status changes.
- **HTML Templates**: Responsive, brand-aligned email templates for all communications.

---

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Project Architecture](#-project-architecture)
- [Detailed Technical Deep Dive](#-detailed-technical-deep-dive)
- [Package Installation](#-package-installation-commands)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Architecture](#-api-architecture)
- [Database & Models](#-database--models)
- [Deployment](#-deployment)

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Frontend** | Next.js 16.1.6, React 19.2.3, TypeScript 5.x |
| **Backend** | Express.js 4.x (Node.js) |
| **Database** | MongoDB + Mongoose 8.x |
| **Payments** | Stripe API, PayPal API |
| **Mailing** | Brevo SMTP API (via fetch) |
| **State** | Redux Toolkit + Redux Persist |
| **AI Models** | Llama 4 Scout (Vision) + Llama 3.3 (Text) via Groq |
| **Security** | Helmet, Express Rate Limit, JWT, Bcrypt |
| **Forms** | Country-State-City for advanced address management |

---

## 🏢 Project Architecture

```
printnest/
├── backend/                              # Express.js API Server
│   ├── lib/                              # Core Libraries (DB, Mailer, Models)
│   ├── middleware/                       # Security & Auth Guards
│   ├── routes/                           # API Modules (Admin, Public, Auth)
│   │   ├── admin/                        # Stats, AI, Warehouses, Logs
│   │   └── public/                       # Storefront, Orders, Cart, Reviews
│   └── server.js                         # Monorepo Server Entry
│
├── frontend/                             # Next.js 16 Client
│   ├── src/
│   │   ├── app/                          # App Router (Pages & Client API)
│   │   ├── components/                   # Specialized UI Modules (Admin, Account)
│   │   ├── lib/                          # Client Utilities & Env
│   │   └── redux/                        # Persistent Global State
│   └── public/                           # Static Media Assets
│
├── data/                                 # Seed data and static JSDBs
├── .env                                  # Unified Environment Config
└── package.json                          # Orchestration Scripts
```

---

## 🔍 Detailed Technical Deep Dive

### 🏗️ 1. Multi-Warehouse Inventory System
PrintNest features a sophisticated inventory model allowing products to be distributed across multiple physical warehouses.
- **Stock Aggregation**: Total stock is automatically calculated from distributed quantities.
- **Bulk Assignment**: Admins can assign products to warehouses en-masse via the warehouse management module.
- **Fulfillment Logic**: Orders track which warehouse specific items were fulfilled from, supporting future logistical expansion.

### 🤖 2. Multimodal AI Workflows
We leverage **Meta’s Llama 4 Scout** to bridge the gap between visuals and text:
- **Image-to-Description**: The AI analyzes uploaded product photos to detect colors, textures, and specific design patterns.
- **SEO Optimization**: It weaves these visual findings into 2-3 sentence paragraphs optimized for Google’s "Helpful Content" guidelines.

### 🔐 3. Security & Audit Trail
- **OTP Verification**: Eliminates spam by requiring 6-digit verification codes for account activation.
- **Audit Logs**: Every admin action (deleting a product, updating stock, promoting a user) is logged with a timestamp, IP info (optional), and admin identity. This log is exportable as CSV for super admins.
- **Protected Sessions**: Uses signed cookies and JWTs with a 15-minute expiry for reset links and a 7-day expiry for standard sessions.

### 💳 4. Complex Payment Management
- **Stripe Session API**: Redirects users to high-converting, localized payment pages.
- **PayPal SDK**: Native integration for users preferring PayPal/Venmo, handling authorizations and captures seamlessly on the backend.

---

## 📦 Package Installation Commands

### Monorepo Setup (Root)
```bash
npm install
```

### Key Dependencies

#### Core & UI
```bash
npm install next@16.1.6 react@19.2.3 mongoose@8.x express@4.x
npm install @reduxjs/toolkit framer-motion lucide-react tailwind-merge
```

#### Specialty
```bash
npm install resend                 # Next-gen transactional email
npm install country-state-city     # Dynamic address selection
npm install stripe                 # Payment orchestration
```

---

## 🚀 Getting Started

### Installation & Launch

1. **Clone & Install**
   ```bash
   git clone <repo-url>
   npm install
   ```

2. **Environment Setup**
   Configure the root `.env` (refer to the documentation below).

3. **Launch Monorepo**
   ```bash
   npm run dev
   ```
   - **Storefront**: `http://localhost:3000`
   - **Backend API**: `http://localhost:5000`

---

## 🔐 Environment Variables

```env
# Database & Core
MONGODB_URI=...
JWT_SECRET=...

# Payments & AI
STRIPE_SECRET_KEY=...
PAYPAL_CLIENT_ID=...
PAYPAL_SECRET=...
GROQ_API_KEY=...

# Email (Brevo Configuration)
BREVO_API_KEY=...
EMAIL_USER=...

# App URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 📡 API Architecture

| Feature | Endpoint | Auth | Key Logic |
|---------|----------|------|-----------|
| **Auth** | `/api/auth/verify-otp` | Public | Activates account via code |
| **Admin** | `/api/admin/warehouses` | Super | Manage stock locations |
| **Admin** | `/api/admin/logs` | Super | Exportable activity CSV |
| **Public**| `/api/public/cart/validate`| Public | Backend price/stock check |
| **Order** | `/api/stripe/checkout` | Auth/Guest| Stripe session generation |

---

## 🗄️ Database & Models

We use **Mongoose 8** with strict schema enforcement:
- **UserModel**: Includes verification status, OTP data, and advanced address fields.
- **WarehouseModel**: Dedicated model for managing storage locations.
- **OrderModel**: Includes explicit `trackingHistory` array for granular delivery updates.
- **ActivityLogModel**: Captures `entity`, `action`, and `admin` metadata.

---

**Happy Printing!** 🖨️✨
