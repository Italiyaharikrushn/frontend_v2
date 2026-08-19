# Kiya Storefront & Admin Dashboard (Frontend v2)

A modern, high-performance E-Commerce Storefront and Admin Management Dashboard built with **React**, **Vite**, **Redux Toolkit (RTK Query)**, and **React Router v7**.

---

## 🏗️ Project Architecture & Folder Structure (`src/`)

The application directory structure is strictly modularized for maintainability, clean imports, and fast team onboarding:

```
src/
├── api/          # RTK Query API service endpoints & HTTP queries
│   ├── authApi.js
│   ├── contactApi.js
│   ├── couponApi.js
│   ├── orderApi.js
│   ├── productApi.js
│   ├── profileApi.js
│   ├── settingsApi.js
│   └── index.js  # Barrel export
│
├── assets/       # Static assets (images, banners, SVGs)
│   ├── hero-banner.png
│   └── react.svg
│
├── components/   # Modular React components
│   ├── admin/    # Admin-specific components (Sidebar)
│   ├── common/   # Shared UI components (Header, CustomerProfileMenu, ProtectedRoute)
│   ├── layouts/  # Page layout wrappers (StorefrontLayout, DashboardLayout)
│   ├── ui/       # Generic re-usable primitives (Button, Card, Input, ToastProvider)
│   └── index.js  # Barrel export
│
├── hooks/        # Custom React hooks
│   ├── useAuth.js
│   ├── useCart.js
│   ├── useToast.js
│   └── index.js  # Barrel export
│
├── pages/        # Route page views & Routing logic
│   ├── admin/    # Dashboard pages (Home, Products, Orders, Customers, Reports, Settings)
│   ├── auth/     # Authentication pages (Login, Register)
│   ├── storefront/ # Customer pages (Home, Products, ProductDetails, Cart, Checkout, etc.)
│   ├── AppRoutes.jsx # Application router
│   └── index.js  # Barrel export
│
├── redux/        # State management (Redux Toolkit)
│   ├── authSlice.js
│   ├── cartSlice.js
│   ├── store.js
│   └── index.js  # Barrel export
│
├── styles/       # Centralized CSS stylesheets
│   └── css/
│       ├── global/       # Global styles & CSS variable tokens (index.css, App.css)
│       ├── components/   # Component-specific stylesheets (Header.css, Sidebar.css, etc.)
│       └── pages/        # Page-specific stylesheets (admin/, auth/, storefront/)
│
└── utils/        # Shared utility functions & helpers
    ├── apiHelpers.js   # Centralized fetchBaseQuery & auth header injection
    ├── formatters.js   # Currency and date formatters
    ├── storage.js      # LocalStorage helpers
    └── index.js        # Barrel export
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v18.x` or higher
- **npm**: `v9.x` or higher

### Environment Variables
Create a `.env` file in the project root:

```env
VITE_BASE_URL=http://localhost:8081
```

### Installation & Development

```bash
# Install dependencies
npm install

# Start local development server with Vite HMR
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

---

## 🛠️ Development Practices for the Team

### 1. Path Aliases (`@/*`)
Use `@` as a shorthand path alias for `src/`.
```javascript
// Recommended:
import { useAuth, useCart } from '@/hooks';
import { Button, Card } from '@/components';
import '@/styles/css/pages/storefront/Home.css';

// Avoid long relative paths:
// import { useAuth } from '../../../hooks/useAuth';
```

### 2. Barrel Exports (`index.js`)
Each directory (`api`, `components`, `hooks`, `pages`, `redux`, `utils`) contains a barrel `index.js` file for clean, single-line imports across the team.

### 3. Centralized API Queries
All RTK Query service slices consume the shared `customFetchBaseQuery` from `@/utils/apiHelpers`, which automatically injects `Authorization: Bearer <token>` into requests.

---

## 📦 Tech Stack
- **Framework**: React 19 + Vite 8
- **State Management**: Redux Toolkit + RTK Query
- **Routing**: React Router DOM v7
- **Icons**: Lucide React
- **PDF Generation**: jsPDF + autoTable
- **Charts**: Recharts
