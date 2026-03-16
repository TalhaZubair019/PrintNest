# 🖨️ PrintNest

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.2.3-blue?logo=react)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://typescriptlang.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-green?logo=mongodb)](https://mongoosejs.com)
[![Express](https://img.shields.io/badge/Express-4.x-lightgrey?logo=express)](https://expressjs.com)
[![Security-Helmet](https://img.shields.io/badge/Security-Helmet-yellow?logo=helmet)](https://helmetjs.github.io/)
[![Stripe](https://img.shields.io/badge/Payment-Stripe-blue?logo=stripe)](https://stripe.com)
[![PayPal](https://img.shields.io/badge/Payment-PayPal-003087?logo=paypal)](https://paypal.com)

A high-performance, full-stack monorepo for custom print-on-demand e-commerce. This system features a hybrid architecture combining a **Next.js 16** (App Router) frontend with a scalable **Express.js** API backend, powered by multimodal AI, multi-warehouse logistics, and a military-grade security audit trail.

---

## 📋 Table of Contents

- [Architectural Blueprint](#-architectural-blueprint)
- [Technical Deep Dive](#-technical-deep-dive)
- [Feature Matrix](#-feature-matrix)
- [API Documentation](#-api-documentation)
- [Database Blueprint](#-database-blueprint)
- [Security & Auditing](#-security--auditing)
- [Mailing Workflow](#-mailing-workflow)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)

---

## 🏗️ Architectural Blueprint

PrintNest utilizes a **monorepo** structure to ensure tight integration between the frontend and backend while maintaining clear separation of concerns.

### [Frontend Layer](./frontend)

- **Framework**: Next.js 16 (App Router)
- **State Management**: Redux Toolkit with **Redux Persist** (Cart & Wishlist durability)
- **Styling**: Tailwind CSS 4.x with `clsx` and `tailwind-merge`
- **Address Management**: Integrated `country-state-city` for localized address validation

### [Backend Layer](./backend)

- **Engine**: Express.js 4.x (Node.js)
- **ORM**: Mongoose 8.x (MongoDB)
- **Mailing**: Brevo (formerly Sendinblue) SMTP API for high-deliverability OTPs and receipts
- **AI Engine**: Groq SDK (Llama 4 Scout Multimodal + Llama 3.3 Text)
- **Security**: Helmet, Express-Rate-Limit, JWT, and Bcrypt

---

## 🔍 Technical Deep Dive

### 🤖 1. Multimodal AI Integration

The product management flow is enhanced by **Meta Llama 4 Scout**:

- **Vision Processing**: The system analyzes product images to detect colors, patterns (e.g., "polka dot", "checkered"), and material textures.
- **Semantic SEO**: It generates 3-sentence descriptions focused on user search intent, automatically weaving LSI keywords based on visual features.
- **Fail-safe**: Falls back to **Llama 3.3 (70B)** for text-based semantic enrichment.

### 📦 2. Multi-Warehouse Inventory System

A sophisticated logistics engine that tracks stock across physical locations:

- **Distributed Stock**: Products can exist in multiple warehouses simultaneously with unique quantities.
- **Bulk Assignment**: Admins can migrate or assign massive product lists to new warehouses in one click.
- **Smart Aggregation**: Real-time stock counts are aggregated across all warehouses for the customer view.

### 💳 3. Complex Payment Orchestration

- **Stripe**: Uses the **Checkout Session API** to handle localized tax, currency, and global cards securely.
- **PayPal**: Native server-side integration for **PAY_NOW** intent, capturing authorization and orders within the backend.

---

## ✨ Feature Matrix

| Feature                   | Customer | Admin | Super Admin |
| ------------------------- | :------: | :---: | :---------: |
| Multimodal AI Description |          |  ✅   |     ✅      |
| Warehouse Management      |          |       |     ✅      |
| Role Promotion/Demotion   |          |       |     ✅      |
| Activity Audit Logs       |          |       |     ✅      |
| Product & Category CRUD   |          |  ✅   |     ✅      |
| Verified Reviews          |    ✅    |  ✅   |     ✅      |
| OTP-Guarded Signup        |    ✅    |       |             |
| Password Recovery         |    ✅    |       |             |

---

## 📡 API Documentation

### Authentication (`/api/auth`)

| Endpoint           | Method | Params                    | Logic                                          |
| ------------------ | ------ | ------------------------- | ---------------------------------------------- |
| `/signup`          | POST   | `{name, email, password}` | Creates unverified user, sends 6-digit OTP     |
| `/verify-otp`      | POST   | `{email, otp}`            | Validates code, activates account, issues JWT  |
| `/login`           | POST   | `{email, password}`       | Checks bcrypt hash, issues secure 7-day cookie |
| `/forgot-password` | POST   | `{email}`                 | Sends JWT-signed reset link (15m expiry)       |
| `/reset-password`  | POST   | `{token, password}`       | Validates link, updates password via bcrypt    |

### Admin Engine (`/api/admin`)

| Endpoint                  | Method   | Scope                | Logic                                        |
| ------------------------- | -------- | -------------------- | -------------------------------------------- |
| `/stats`                  | GET      | `startDate, endDate` | Real-time analytics, revenue, top-sellers    |
| `/warehouses`             | GET/POST | Super                | CRUD for physical storage locations          |
| `/warehouses/bulk-assign` | POST     | Admin                | Distribute multiple products to a warehouse  |
| `/logs`                   | GET      | `entity, action`     | Filterable admin activity audit trail        |
| `/logs/export`            | GET      | Super                | Generates signed CSV of all activity history |

### Storefront (`/api/public`)

| Endpoint         | Method | Logic                                                            |
| ---------------- | ------ | ---------------------------------------------------------------- |
| `/cart/validate` | POST   | Validates frontend cart price/stock against DB                   |
| `/place-order`   | POST   | Atomic transaction: Save order, update stock, send Brevo receipt |
| `/reviews`       | POST   | Verified check: Only allows reviews on purchased items           |

---

## 🗄️ Database Blueprint

### `UserModel`

- `isAdmin` (Boolean) & `adminRole` (`super_admin` \| `admin`)
- `isVerified` (Boolean): Guard for account activation.
- `otp` & `otpExpiresAt`: Temporary verification state.
- `savedCards`: Array of encrypted payment identifiers.

### `OrderModel`

- `status`: `Processing` \| `Shipped` \| `Delivered` \| `Cancelled`
- `trackingHistory`: Array of `{status, message, timestamp}` for granular tracking.
- `fulfilledFromWarehouse`: Maps order items to specific physical warehouses.

### `ActivityLogModel`

- `adminId`, `adminName`, `adminEmail`: Identify the actor.
- `entity`: `product` \| `category` \| `order` \| `warehouse` \| `user`
- `action`: `add` \| `update` \| `delete` \| `promote` \| `demote`

---

## 🔐 Security & Auditing

### 🛡️ Administrative Guardrails

Professional role-based access control (RBAC):

- **Super Admin**: Only these users can access activity logs, manage other admins, and modify warehouses.
- **Promotion Logic**: Standard users matching the `EMAIL_USER` environment variable are automatically granted Super Admin status upon connection to prioritize initial setup.

### 📜 Digital Audit Trail

Every impactful administrative action is recorded:

- **Logged Details**: Includes a human-readable summary of what changed (e.g., "Updated warehouse: Dallas (North Side)").
- **Transparency**: Logs cannot be modified or deleted via the API, ensuring a permanent record for accountability.

---

## 📧 Mailing Workflow

The system uses **Brevo (Sendinblue)** for a zero-trust, high-deliverability email flow:

1.  **Identity Verification**: 6-digit OTPs sent during signup and account recovery.
2.  **Transactional Receipts**: Modern HTML templates with product thumbnails and tracking links.
3.  **Fail-fast Logic**: If the mailing server fails, errors are logged but system state remains atomic.

---

## 🚀 Getting Started

### Installation

```bash
# 1. Clone
git clone <url> && cd printnest

# 2. Install Monorepo
npm install

# 3. Environment
cp .env.example .env

# 4. Launch (Backend: 5000, Frontend: 3000)
npm run dev
```

---

## 🔐 Environment Variables

| Variable            | Source                       | Description                       |
| ------------------- | ---------------------------- | --------------------------------- |
| `MONGODB_URI`       | MongoDB Atlas                | Cluster connection string         |
| `JWT_SECRET`        | System                       | 32+ char secret for token signing |
| `BREVO_API_KEY`     | [Brevo](https://brevo.com)   | API key for SMTP mailing          |
| `STRIPE_SECRET_KEY` | [Stripe](https://stripe.com) | Secret key for backend payments   |
| `GROQ_API_KEY`      | [Groq](https://groq.com)     | AI SDK access key                 |
| `EMAIL_USER`        | Admin                        | Initial Super Admin email         |

---

**Made with ❤️ for high-performance e-commerce** 🖨️✨
