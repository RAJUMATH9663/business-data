# LeadSetu — Security & Data Protection Model

## 1. Overview
LeadSetu is engineered with a defense-in-depth security model to safeguard commercial contact datasets, prevent automated scraping, protect user sessions, and secure payment processing.

---

## 2. Authentication & Session Security

### 2.1 Password Security
- Passwords are hashed using **Bcrypt with 12 salt rounds** before storage in the database.
- Constant-time dummy hashes are used during login failures to prevent user-enumeration timing attacks.

### 2.2 Stateless HMAC Token Hashing
- User session tokens are cryptographically signed using **HMAC-SHA256** with `NEXTAUTH_SECRET`.
- Only the hashed token signature is stored in the database `user_sessions` table.
- Raw session tokens reside exclusively inside `httpOnly`, `SameSite=Lax`, `Secure` browser cookies.

### 2.3 Device & Session Management
- Multi-device management allows up to **3 concurrent active devices** per account.
- When a 4th device authenticates, the oldest active session is automatically terminated.
- Sessions automatically expire after **7 days** of inactivity.

---

## 3. Data Leakage Prevention & Anti-Scraping

### 3.1 Paginated In-Browser Viewer
- Contact datasets are never distributed as raw downloadable files (Excel/CSV).
- Contacts are fetched dynamically in pages of 20 records over authenticated API requests.
- Direct database business IDs are never exposed in public endpoints.

### 3.2 Dynamic Visual Watermarking
- The DataViewer renders an SVG-based dynamic background watermark embedding the customer's full name, email, and purchase transaction code.
- Any screenshot or recording immediately identifies the licensee responsible for leakage.

### 3.3 UI Deterrence
- Browser context menu (`right-click`), text selection, copy shortcuts (`Ctrl+C`), and print styles are disabled on data viewing pages.

---

## 4. Payment Security & Integrity

### 4.1 Server-Side Price Verification
- Order pricing is never trusted from the client. The server calculates the exact payable amount from the database `pricing_rules` table based on target district, category, and quantity.

### 4.2 Cryptographic Signature Verification
- Razorpay payment signatures are validated using **HMAC-SHA256**:
  ```ts
  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(orderId + "|" + razorpayPaymentId)
    .digest("hex");
  ```
- Purchases are marked `PAID` only when the cryptographic signature matches.

### 4.3 Webhook Fallback
- An asynchronous webhook listener (`/api/razorpay/webhook`) validates the Razorpay webhook secret signature, guaranteeing that data is unlocked even if a customer closes their browser immediately after payment.

---

## 5. Network & Request Protection

### 5.1 Rate Limiting
- An in-memory sliding window rate limiter protects sensitive endpoints:
  - **Login / Register**: Max 5 attempts per minute per IP.
  - **Quotes / Orders**: Max 20 requests per minute per IP.
  - **Contact Retrieval**: Max 30 requests per minute per authenticated user.

### 5.2 CSRF & Origin Defense
- State-changing API requests (`POST`, `PATCH`, `DELETE`) require identical origin headers (`sec-fetch-site` and `origin` matching `host`).

### 5.3 SQL Injection & XSS Prevention
- All database interactions use Prisma ORM with parameterized queries, preventing SQL injection.
- User input is validated and sanitized through strict Zod schemas before reaching business logic.
- Content Security Policy (CSP) and HTTP security headers are configured in Next.js middleware and headers.
