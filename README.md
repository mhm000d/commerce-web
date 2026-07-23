# Commerce – Frontend

[![Next.js](https://img.shields.io/badge/Next.js-16.2.9-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

A modern, responsive e‑commerce frontend built with Next.js, React, and Tailwind CSS. It integrates seamlessly with a .NET backend API and provides a full shopping experience including product browsing, search, cart management, checkout, user accounts, and admin controls.

---

## ✨ Features

- **🔍 Full‑text Search** – Autocomplete with debouncing, keyboard navigation, and image previews.
- **🛒 Shopping Cart** – Zustand store with add/update/remove/clear, real‑time sync with the backend.
- **📦 Checkout** – Address selection, payment method (Stripe / Cash on Delivery), and order review with Stripe Embedded Checkout.
- **📝 Product Reviews** – Full CRUD with verified‑purchase enforcement, ownership checks, deletion dialog, and pagination.
- **📋 Address Management** – Create, edit, delete addresses with a max of 5, unique default, and zero‑default protection.
- **👤 User Account** – Profile editing, password change, and order history.
- **🛠️ Admin Panel** – Product CRUD with image upload (during creation), order management with status updates.
- **🎨 UI Consistency** – Indigo brand colours, toast notifications, breadcrumbs, rating stars, loading skeletons, and premium product cards with aligned pricing/ratings and reserved title heights to prevent layout overlaps.
- **📱 Mobile‑First** – Responsive design with bottom navigation, search‑first header, and a full-featured mobile menu drawer displaying icons for categories and account options.
- **🔌 Transparent API Versioning & Proxy** – Transparent version prefixing (e.g., `/v1`) in the Next.js API BFF proxy and server-side fetch wrappers controlled dynamically via environment configurations.
- **✨ OpenAPI Type-Safety** – Automated client type generation from Swagger endpoints utilizing `openapi-typescript` and `openapi-fetch`.

---

## 🧰 Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **UI Library** | [React 19](https://react.dev/) |
| **State Management** | [Zustand](https://zustand-demo.pmnd.rs/) + [TanStack Query v5](https://tanstack.com/query/latest) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) |
| **Type Safety** | [TypeScript 5](https://www.typescriptlang.org/) |
| **HTTP Client** | Native `fetch` with `clientFetch` wrapper, using [openapi-fetch](https://openapi-ts.pages.dev/openapi-fetch/) |
| **Codegen** | [openapi-typescript](https://openapi-ts.pages.dev/openapi-typescript/) |
| **Payments** | [Stripe](https://stripe.com/) (Embedded Checkout) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Package Manager** | `pnpm` |

---

## 📁 Project Structure

```bash
commerce-web/
├── app/                   
│   ├── (admin)/           # Admin dashboard and management
│   ├── (auth)/            # Authentication (login, register, etc.)
│   ├── (checkout)/        # Checkout process
│   ├── (shop)/            # Public shop, account, and orders
│   └── api/               # API routes (auth and backend proxy)
├── components/            # React components
│   ├── admin/             # Admin‑specific components
│   ├── ui/                # shadcn/ui primitives
│   └── ...                # Feature‑based components
├── constants/             # Shared constants
├── hooks/                 # Custom React hooks
├── lib/                   # API client and utilities
│   └── api/               # Backend API services
├── store/                 # Zustand state management
├── types/                 # TypeScript type definitions (api.ts generated from Swagger)
└── ...                    # Config files (next.config.ts, etc.)
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 20.x
- **pnpm** ≥ 8.x (or npm / yarn)

### 1. Clone the repository

```bash
git clone https://github.com/mhm000d/commerce-web.git
cd commerce-web
```
### 2. Install dependencies
```bash
pnpm install
```
### 3. Set up environment variables
```bash
cp .env.example .env
```
Ensure you set the API configurations (e.g. `API_VERSION=v1` and `NEXT_PUBLIC_API_VERSION=v1`).

### 4. Code Generation (OpenAPI Types)
To generate the latest TypeScript types from your local running backend Swagger schema:
```bash
pnpm openapi:generate
```

### 5. Run the development server
```bash
pnpm dev
```
Open http://localhost:3000 in your browser.
