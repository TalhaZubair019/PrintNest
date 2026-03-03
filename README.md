# 🖨️ PrintNest — Modern Print-on-Demand E-Commerce Store

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.2.3-blue?logo=react)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://typescriptlang.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-green?logo=mongodb)](https://mongoosejs.com)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.11-purple?logo=redux)](https://redux-toolkit.js.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-cyan?logo=tailwindcss)](https://tailwindcss.com)

A modern, full-stack e-commerce platform for custom print-on-demand products. Built with **Next.js 16** (Frontend) and **Express** (Backend), featuring a complete admin panel, MongoDB database, AI-powered product descriptions, premium HTML email notifications, and real-time analytics.

---

## ✨ Key Features

### 🛒 E-Commerce

- **Product Catalog** with quick view, comparison, and wishlist
- **Shopping Cart** with quantity controls and localStorage persistence
- **Wishlist** with Redux state management
- **Dynamic Product Categories** (T-shirts, Business Cards, Hoodies, Packaging)
- **Product Review System** with ratings and comments
- **Checkout** with billing, payment selection, and order confirmation

### 🔐 Authentication & Users

- **Sign Up / Login** with bcrypt password hashing
- **JWT Authentication** via HTTP-only cookies
- **User Dashboard** with order history
- **Guest Checkout** support
- **Role-based Access** — admin vs standard user

### 🛠️ Admin Panel (`/admin`)

- **Dashboard** with charts: revenue, orders, top products, user stats
- **Product Management** — add, edit, delete products
- **Order Management** — view and update order statuses
- **User Management** — view, promote, delete users
- **Review Moderation** — view and manage all reviews
- **AI Description Generator** powered by Groq (Llama 3.1)
- **Image Upload** endpoint for products

### 🤖 AI Integration

- **AI Product Descriptions** via Groq API (Llama 3.1 8B Instant)
- Generates compelling 2–3 sentence product descriptions from a title

### 📧 Order & Email

- Orders saved to **MongoDB**
- **Premium HTML Email Notifications** sent to customer and store via Nodemailer
- Emails include detailed order summaries (item names, prices, quantities)
- Order status update notifications for customers
- Guest and authenticated order tracking

---

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Package Installation](#-package-installation-commands)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Routes](#-api-routes)
- [Database & Models](#-database--models)
- [Redux Store](#-redux-store)
- [Admin Panel](#-admin-panel)
- [Pages & Routes](#-pages--routes)
- [Deployment](#-deployment)

---

## 🛠️ Tech Stack

| Category             | Technology                   |
| -------------------- | ---------------------------- |
| **Framework**        | Next.js 16.1.6 (App Router)  |
| **Frontend**         | React 19.2.3                 |
| **Language**         | TypeScript 5.x               |
| **Backend**          | Express.js                   |
| **Database**         | MongoDB via Mongoose 8.x     |
| **Styling**          | Tailwind CSS 4.x             |
| **Animations**       | Framer Motion 12.x           |
| **State Management** | Redux Toolkit 2.x            |
| **Icons**            | Lucide React                 |
| **Authentication**   | JWT + bcryptjs               |
| **Email**            | Nodemailer (Gmail SMTP)      |
| **AI**               | Groq API (Llama 3.1 8B)      |
| **Utilities**        | clsx, tailwind-merge, cookie |

---

## 📦 Package Installation Commands

### Install All at Once

```bash
npm install
```

### Production Dependencies

```bash
# Install all production deps at once
npm install @google/generative-ai @reduxjs/toolkit bcryptjs clsx cookie framer-motion jsonwebtoken lucide-react mongoose next nodemailer react react-dom react-redux tailwind-merge
```

Or install individually:

#### Framework & Core

```bash
npm install next@16.1.6          # Next.js framework
npm install react@19.2.3         # React library
npm install react-dom@19.2.3     # React DOM renderer
```

#### Database

```bash
npm install mongoose@^9.2.1      # MongoDB ODM
```

#### State Management

```bash
npm install @reduxjs/toolkit@^2.11.2   # Redux Toolkit
npm install react-redux@^9.2.0         # React bindings for Redux
```

#### Authentication & Security

```bash
npm install bcryptjs@^3.0.3            # Password hashing
npm install jsonwebtoken@^9.0.3        # JWT tokens
npm install cookie@^1.1.1              # Cookie parsing
```

#### UI & Styling

```bash
npm install framer-motion@^12.30.0     # Animations
npm install lucide-react@^0.563.0      # Icons
npm install clsx@^2.1.1                # Conditional classNames
npm install tailwind-merge@^3.4.0      # Tailwind class merging
```

#### Email & AI

```bash
npm install nodemailer@^6.9.13         # Email sending (SMTP)
npm install @google/generative-ai@^0.24.1  # Google AI SDK
```

### Development Dependencies

```bash
# Install all dev deps at once
npm install -D @tailwindcss/postcss @types/bcryptjs @types/cookie @types/jsonwebtoken @types/node @types/nodemailer @types/react @types/react-dom babel-plugin-react-compiler eslint eslint-config-next tailwindcss typescript
```

Or install individually:

#### TypeScript & Types

```bash
npm install -D typescript@^5
npm install -D @types/node@^20
npm install -D @types/react@^19
npm install -D @types/react-dom@^19
npm install -D @types/bcryptjs@^2.4.6
npm install -D @types/cookie@^0.6.0
npm install -D @types/jsonwebtoken@^9.0.10
npm install -D @types/nodemailer@^7.0.9
```

#### CSS & Build Tools

```bash
npm install -D tailwindcss@^4
npm install -D @tailwindcss/postcss@^4
npm install -D eslint@^9
npm install -D eslint-config-next@16.1.6
npm install -D babel-plugin-react-compiler@1.0.0
```

### Package Purposes

| Package                 | Purpose                                           |
| ----------------------- | ------------------------------------------------- |
| `@google/generative-ai` | Google AI SDK (installed alongside Groq)          |
| `@reduxjs/toolkit`      | Simplified Redux with createSlice, configureStore |
| `bcryptjs`              | Secure password hashing                           |
| `clsx`                  | Conditional className utility                     |
| `cookie`                | HTTP cookie parsing                               |
| `framer-motion`         | Page and component animations                     |
| `jsonwebtoken`          | JWT creation and verification                     |
| `lucide-react`          | Icon component library                            |
| `mongoose`              | MongoDB ODM for data modeling                     |
| `next`                  | React framework (SSR, routing, API)               |
| `nodemailer`            | Send order confirmation emails                    |
| `react` / `react-dom`   | UI library and DOM renderer                       |
| `react-redux`           | Redux bindings for React                          |
| `tailwind-merge`        | Merge Tailwind classes without conflicts          |
| `tailwindcss`           | Utility-first CSS framework                       |
| `typescript`            | Static typing for JavaScript                      |

---

## 📁 Project Structure

```
printnest/
├── backend/                              # Express Backend
│   ├── lib/                              # DB connection & models
│   ├── middleware/                       # Auth & Admin guards
│   ├── routes/                           # API Route handlers
│   │   ├── admin.js                      # Admin stats & management
│   │   ├── public.js                     # Public shop APIs
│   │   ├── auth.js                       # Login/Signup logic
│   │   └── ...                           # Stripe/PayPal integrations
│   └── server.js                         # Express entry point
│
├── frontend/                             # Next.js 16 Frontend
│   ├── src/
│   │   ├── app/                          # App Router pages
│   │   ├── components/                   # UI & Section components
│   │   ├── lib/                          # Client utilities
│   │   └── redux/                        # Global state management
│   ├── public/                           # Static assets
│   ├── tailwind.config.ts
│   └── next.config.ts
│
├── data/                                 # Shared static data
├── .env                                  # Root environment variables
├── package.json                          # Monorepo scripts
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.0 or higher
- **MongoDB** database (Atlas or local)
- **Groq API key** (for AI descriptions)
- **Gmail** account (for email notifications)

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd printnest
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create `.env`** (see [Environment Variables](#-environment-variables))

4. **Run development server**

   ```bash
   npm run dev
   ```

5. **Open browser**
   ```
   http://localhost:3000
   ```

### Scripts

| Command                | Description                      |
| ---------------------- | -------------------------------- |
| `npm run dev`          | Start BOTH frontend and backend  |
| `npm run dev:frontend` | Start Next.js development server |
| `npm run dev:backend`  | Start Express (Nodemon) server   |
| `npm run build`        | Build frontend for production    |
| `npm start`            | Start production frontend server |
| `npm run lint`         | Run ESLint on frontend           |

---

## 🔐 Environment Variables

Create `.env` in the project root:

```env
# MongoDB
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/printnest

# JWT Authentication
JWT_SECRET=your-secret-key-minimum-32-characters

# Email (Gmail SMTP)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password

# AI Descriptions (Groq)
GROQ_API_KEY=your-groq-api-key
```

### Getting API Keys

| Service                | URL                                                                            |
| ---------------------- | ------------------------------------------------------------------------------ |
| **MongoDB Atlas**      | [cloud.mongodb.com](https://cloud.mongodb.com)                                 |
| **Groq API**           | [console.groq.com](https://console.groq.com)                                   |
| **Gmail App Password** | [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords) |

> **Note**: `MONGODB_URI` and `JWT_SECRET` are **required** — the app will throw on startup if missing.

---

## 📡 API Routes

### Auth Routes (`/api/auth`)

| Endpoint  | Method | Description                    |
| --------- | ------ | ------------------------------ |
| `/signup` | POST   | Register new user              |
| `/login`  | POST   | Login and receive JWT cookie   |
| `/me`     | GET    | Get current authenticated user |
| `/logout` | POST   | Clear auth cookie              |

### Public Routes (`/api/public`)

| Endpoint       | Method | Description                   |
| -------------- | ------ | ----------------------------- |
| `/content`     | GET    | All site content from db.json |
| `/place-order` | POST   | Submit order + send emails    |
| `/orders`      | GET    | Get orders for current user   |
| `/reviews`     | GET    | Get product reviews           |
| `/reviews`     | POST   | Submit a new review           |

### Admin Routes (`/api/admin`) (🔒 Admin only)

| Endpoint          | Method          | Description                     |
| ----------------- | --------------- | ------------------------------- |
| `/stats`          | GET             | Dashboard analytics & charts    |
| `/products`       | GET/POST/DELETE | Manage product catalog          |
| `/orders`         | GET/PATCH       | View and update orders          |
| `/users`          | GET             | List all users                  |
| `/users/[id]`     | DELETE/PATCH    | Delete or promote users         |
| `/ai-description` | POST            | Generate AI product description |

---

## 🗄️ Database & Models

The app uses **MongoDB** with Mongoose. Connection is cached globally for serverless efficiency.

### Models

#### User

```typescript
{ name, email, password, phone, address, city, country, cart[], wishlist[], isAdmin }
```

#### Product

```typescript
{
  (id, title, price, oldPrice, image, badge, printText, createdAt, updatedAt);
}
```

#### Order

```typescript
{ id, userId, date, status, total, items[], customer }
```

#### Review

```typescript
{
  (productId, userId, userName, userImage, rating, comment, date, createdAt);
}
```

### Admin Promotion

The user matching `EMAIL_USER` env var is automatically granted admin on each DB connection.

---

## 🏪 Redux Store

### Slices

#### Cart (`CartSlice.tsx`)

```typescript
// State
{ cartItems: CartItem[], totalQuantity: number, totalAmount: number }

// Actions
addToCart(item)         // Add or increment
removeFromCart(id)      // Decrement by 1
deleteItem(id)          // Remove entirely
initializeCart(state)   // Restore from localStorage
```

#### Wishlist (`WishListSlice.tsx`)

```typescript
// State
{ items: WishlistItem[] }

// Actions
toggleWishlist(item)    // Add or remove
```

#### Auth (`AuthSlice.tsx`)

```typescript
// State
{ isAuthenticated: boolean, user: User | null, token: string | null }

// Actions
loginSuccess({ user, token })
logout()
```

---

## 🛠️ Admin Panel

Access the admin panel at `/admin/dashboard` (requires admin account).

### Dashboard Analytics

- **KPI Cards** — Total users, orders, revenue, reviews
- **Revenue Chart** — Daily revenue over a date range
- **Order Trend** — Orders per day
- **Top Products** — Best-selling items
- **Category Sales** — Revenue breakdown by category
- **Order Velocity** — Orders by hour of day
- **Review Stats** — Rating distribution and sentiment analysis

### Product Management

- Add products with title, price, image, badge
- **AI description generator** — click to auto-generate from title using Groq
- Edit and delete existing products
- Image upload support

### User & Order Management

- View all users with order counts
- Promote/demote admin status
- Delete users
- Update order statuses

---

## 📄 Pages & Routes

### Public Pages

| Route              | Description                                   |
| ------------------ | --------------------------------------------- |
| `/`                | Home (Hero, Products, Categories, Blog, etc.) |
| `/shop`            | All products grid                             |
| `/product/[slug]`  | Product detail with reviews                   |
| `/category/[slug]` | Category-filtered products                    |
| `/blog/[slug]`     | Blog post                                     |
| `/cart`            | Shopping cart                                 |
| `/wishlist`        | Saved products                                |
| `/login`           | Login                                         |
| `/signup`          | Registration                                  |
| `/thank-you`       | Order confirmation                            |

### Protected Pages

| Route       | Description                        |
| ----------- | ---------------------------------- |
| `/account`  | User dashboard + order history     |
| `/checkout` | Checkout (login prompt for guests) |

### Admin Pages (Admin only)

| Route              | Description             |
| ------------------ | ----------------------- |
| `/admin/dashboard` | Analytics & data charts |
| `/admin/products`  | Product management      |
| `/admin/reviews`   | Review moderation       |

### Dynamic Route Slugs

```
"Print Mug"  →  /product/print-mug
"T-shirts"   →  /category/t-shirts
```

---

## 🌐 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Add all environment variables in the Vercel dashboard
4. Deploy — Next.js detected automatically

> ⚠️ Vercel's filesystem is ephemeral. All data **must** be stored in MongoDB.

### Other Platforms

Works on any Node.js 18+ host (Railway, Render, DigitalOcean, AWS):

```bash
npm run build
npm start
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit changes (`git commit -m 'feat: add my feature'`)
4. Push branch (`git push origin feature/my-feature`)
5. Open a Pull Request

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

**Made with ❤️ for the printing community** 🖨️✨
