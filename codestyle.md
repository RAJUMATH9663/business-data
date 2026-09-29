# LeadSetu — Code Style & Standards (codestyle.md)

## 1. Principles
1. **Clarity Over Cleverness**: Code should be explicit, readable, and self-documenting.
2. **Strict Type Safety**: Avoid `any` types; prefer strict TypeScript interfaces, discriminated unions, and Zod schemas.
3. **Fail-Fast Error Handling**: Validate inputs at system boundaries and throw typed errors.

---

## 2. TypeScript & Project Conventions

### 2.1 File & Directory Naming
- Components: PascalCase (`components/AuthForm.tsx`, `components/DataViewer.tsx`).
- Utility & Service Modules: kebab-case (`lib/pricing-core.ts`, `lib/rate-limit.ts`).
- Route Handlers: App router convention (`app/api/quote/route.ts`).

### 2.2 Typing Best Practices
- Define explicit request and response types for all API endpoints.
- Use `type` for simple object structures and unions; use `interface` when extending complex shapes.
- Example:
  ```ts
  export type QuoteResponse = {
    districtId: number;
    categoryId: number;
    quantity: number;
    ratePaise: number;
    basePaise: number;
    discountPercent: number;
    discountPaise: number;
    finalPaise: number;
    totalAvailable: number;
    alreadyPurchased: number;
    nextStartNumber: number;
  };
  ```

---

## 3. React & Next.js Guidelines

### 3.1 Server vs. Client Components
- Default to **React Server Components (RSC)** for data fetching, static page generation, and admin layout wrappers.
- Add `"use client";` at the very top only when the component requires state (`useState`, `useEffect`), event handlers, or browser APIs.

### 3.2 Error Handling in API Routes
- Use the standard `apiHandler` wrapper or return `NextResponse.json({ error: message }, { status: code })`.
- Return proper HTTP status codes:
  - `400 Bad Request` for schema validation failures.
  - `401 Unauthorized` for missing/invalid credentials.
  - `403 Forbidden` for role mismatch or blocked requests.
  - `404 Not Found` for nonexistent resources.
  - `429 Too Many Requests` when rate limits are exceeded.
  - `500 Internal Server Error` for unhandled server exceptions.

---

## 4. CSS & Styling Conventions

- Use **Tailwind CSS** with utility classes and semantic components defined in `app/globals.css`.
- Always style using CSS variables (`var(--bg-page)`, `var(--bg-card)`, `var(--text-main)`, etc.) to ensure seamless dark and light mode rendering.
- Never use non-standard or unsupported Tailwind classes (e.g. `shadow-xs`, `shadow-2xs` are unsupported in Tailwind v3; use `shadow-sm`, `shadow-md`).
- Ensure all interactive buttons maintain `forced-color-adjust: none;`.

---

## 5. Database & Prisma Conventions

- Never execute raw SQL queries when Prisma query builder methods are available.
- For multi-step data mutations that must succeed or fail together (e.g., verifying payments and allocating purchased contacts), always use `prisma.$transaction([...])`.
- Select only the necessary fields on heavy queries (`select: { id: true, name: true, phone: true }`).
