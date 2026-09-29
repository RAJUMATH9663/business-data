# LeadSetu — Technical Architecture

## 1. System Overview
LeadSetu is built on a full-stack Next.js 14 application architecture utilizing the App Router with React Server Components (RSC) and Client Components. The backend interacts directly with a relational MySQL database via Prisma ORM.

```
+-------------------------------------------------------------+
|                      Client Layer (Browser)                 |
|   - Next.js Client Components (React 18)                    |
|   - Theme Provider & Viewport CSS System                   |
|   - Razorpay Checkout JS SDK                                |
+------------------------------+------------------------------+
                               | HTTPS / JSON
+------------------------------v------------------------------+
|                   Next.js 14 App Router                     |
|  +------------------------+  +---------------------------+  |
|  |   Server Components    |  |     API Routes (REST)     |  |
|  | - Page Renderers       |  | - /api/quote              |  |
|  | - Route Guards (Auth)  |  | - /api/orders (create/pay)|  |
|  | - Layout & Meta Engine |  | - /api/purchases/:id      |  |
|  +------------------------+  +---------------------------+  |
|                               |                             |
|  +----------------------------v--------------------------+  |
|  |              Service & Validation Layer               |  |
|  | - Pricing & Quote Engine  - Importer & Normalizer     |  |
|  | - Auth & Session Engine   - Razorpay Signature Verify |  |
|  | - In-Memory Rate Limiter  - Zod Request Validators    |  |
|  +----------------------------+--------------------------+  |
+-------------------------------+-----------------------------+
                                | Prisma Query Engine
+-------------------------------v-----------------------------+
|                     Data Persistence                        |
|   - MySQL 8.0+ Database (InnoDB, UTF8mb4)                   |
|   - Prisma ORM Schema & Client Generation                   |
+-------------------------------------------------------------+
```

---

## 2. Technology Stack

| Component | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Framework** | Next.js | 14.2.15 | Full-stack App Router, SSR, API routes |
| **Language** | TypeScript | 5.6+ | Type safety & domain modeling |
| **UI Library** | React | 18.3.1 | Component rendering & state management |
| **Styling** | Tailwind CSS | 3.4.1 | Utility-first CSS with CSS custom properties |
| **Database** | MySQL | 8.0+ | Relational data store |
| **ORM** | Prisma | 5.22.0 | Schema modeling, migrations, query building |
| **Payments** | Razorpay SDK | 2.9.4 | Payment intent creation & signature verification |
| **File Parsing** | SheetJS (xlsx) | 0.18.5 | High-speed spreadsheet validation & streaming import |
| **Validation** | Zod | 3.23.8 | Schema validation on all inbound API payloads |
| **Cryptography** | Node Crypto / Bcrypt | 2.4.3 | HMAC-SHA256 token hashing, Bcrypt (12 rounds) |

---

## 3. Directory & Module Structure

```
karnataka-business-data/
├── app/                      # Next.js 14 App Router routes
│   ├── (auth)/               # Authentication pages (/login, /register)
│   ├── account/              # User profile and session management
│   ├── admin/                # Admin Control Center (districts, categories, import, orders)
│   ├── api/                  # Backend REST API route handlers
│   │   ├── admin/            # Administrative endpoints (CRUD & bulk import)
│   │   ├── auth/             # Authentication & session endpoints
│   │   ├── catalog/          # Dynamic category & district counts
│   │   ├── orders/           # Order creation & signature verification
│   │   ├── purchases/        # Secured contact retrieval & pagination
│   │   ├── quote/            # Real-time pricing & availability quote engine
│   │   └── razorpay/webhook/ # Webhook listener for asynchronous payment capture
│   ├── explore/              # Interactive 3-step district/category dataset selection
│   ├── purchases/            # Customer purchase library and protected viewer
│   ├── layout.tsx            # Global layout, theme injector, and navigation
│   └── page.tsx              # Conversion-focused landing page
├── components/               # Reusable React components
│   ├── AuthForm.tsx          # Login & Register modal/card
│   ├── Crud.tsx              # Generic JSON-backed CRUD table & form generator
│   ├── DataViewer.tsx        # Protected contact viewer with dynamic watermarking
│   ├── ExploreFlow.tsx       # 3-step wizard (District -> Category -> Quote -> Pay)
│   ├── ImportClient.tsx      # Excel upload, pre-import validation, & batch committer
│   ├── Navbar.tsx            # Sticky desktop & bottom mobile navigation
│   └── ThemeToggle.tsx       # Dark/Light mode switcher with localStorage sync
├── lib/                      # Business logic, services, and shared utilities
│   ├── api.ts                # Standardized JSON response helpers and API errors
│   ├── auth.ts               # Session verification, HMAC token hashing, RBAC guards
│   ├── catalog.ts            # Category taxonomies and district metadata
│   ├── db.ts                 # Global Prisma client singleton
│   ├── format.ts             # Currency (INR) and integer formatting helpers
│   ├── importer.ts           # Excel parsing, column mapping, and deduplication
│   ├── phone.ts              # Phone normalization & 10-digit sanitization
│   ├── pricing-core.ts       # Mathematical volume tier discount algorithms
│   ├── pricing.ts            # Database-backed pricing rule calculator
│   ├── purchases.ts          # Contact allocation and pagination logic
│   ├── ratelimit.ts          # In-memory sliding window rate limiter
│   ├── razorpay.ts           # Razorpay client instance and signature validator
│   └── validators.ts         # Zod schemas for all inbound requests
├── prisma/                   # Database schema & reference data seeders
│   ├── schema.prisma         # Declarative schema definition
│   └── seed.ts               # District, category, and pricing rules seeder
├── public/                   # Static assets, branding, and icons
└── scripts/                  # Unit tests and administrative data scripts
```

---

## 4. Key End-to-End Data Flows

### 4.1 Discovery to Purchase & Allocation Flow
```
User (Browser)               Next.js API (/api/quote)           Prisma / MySQL
     |                                 |                             |
     | 1. Select District & Category   |                             |
     |-------------------------------->| 2. Count active businesses   |
     |                                 |    Check user owned count   |
     |                                 |---------------------------->|
     | 3. Returns live quote & offsets |                             |
     |<--------------------------------|                             |
     |                                 |                             |
     | 4. Click "Pay"                  |                             |
     |-------------------------------->| 5. Create Razorpay order    |
     |                                 |    Store pending in DB      |
     |                                 |---------------------------->|
     | 6. Open Razorpay Modal          |                             |
     |    User completes payment       |                             |
     |                                 |                             |
     | 7. Send payment signature       |                             |
     |-------------------------------->| 8. Verify HMAC-SHA256       |
     |                                 |    Allocate fresh contacts  |
     |                                 |    Mark Order PAID (Atomic) |
     |                                 |---------------------------->|
     | 9. Redirect to DataViewer       |                             |
     |<--------------------------------|                             |
```

### 4.2 Protected Contact Retrieval Flow
```
DataViewer (Browser)          /api/purchases/:id/contacts      Prisma / MySQL
     |                                     |                         |
     | 1. Request page 1 with session      |                         |
     |------------------------------------>| 2. Verify Auth & RBAC   |
     |                                     |    Verify Purchase PAID |
     |                                     |------------------------>|
     |                                     | 3. Fetch 20 contacts    |
     |                                     |    from purchase_contacts
     |                                     |    Log to contact_views |
     |                                     |------------------------>|
     | 4. Return paginated records         |                         |
     |<------------------------------------|                         |
     | 5. Render with dynamic watermark    |                         |
```
