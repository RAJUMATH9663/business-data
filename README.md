# LeadSetu

A modern, high-conversion marketplace for verified B2B and retail business contact datasets across Karnataka districts.

**District → Category → Quantity → Secure Checkout → View Verified Contacts.**

Tech Stack: Next.js 14 (App Router) · TypeScript · Tailwind CSS · MySQL + Prisma ORM · Razorpay Payment Gateway · SheetJS (xlsx) · Zod Validation.

---

## Getting Started

### 1. Prerequisites
- Node.js 18.18+ or 20+
- MySQL 8.0+

### 2. Environment Configuration
Copy the template configuration file:
```bash
cp .env.example .env
```
Fill in the required environment variables in `.env`:
- `DATABASE_URL`: Connection string to your MySQL database.
- `NEXTAUTH_SECRET`: Random 32-byte string for cryptographic session signing (`openssl rand -base64 32`).
- `NEXT_PUBLIC_RAZORPAY_KEY_ID` & `RAZORPAY_KEY_SECRET`: Razorpay API credentials from your Razorpay Dashboard.
- `PAYMENT_MODE`: `"razorpay"` for active checkout, or `"mock"` for local testing.
- `ADMIN_EMAIL` & `ADMIN_PASSWORD`: Credentials for the administrator account created during reference seeding.

### 3. Database Initialization
```bash
# Generate Prisma Client
npx prisma generate

# Push database schema
npx prisma db push

# Seed reference data (31 Karnataka districts, 20 categories, volume pricing tiers)
npm run seed
```

### 4. Running Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Security & Access Control

- **Data Privacy & Leakage Prevention**: Contact data is never distributed as downloadable spreadsheets or bulk dumps. Contacts are served paginated exclusively inside authenticated, watermarked views for authorized purchases.
- **Zero Duplicate Numbers**: The allocation engine tracks previously purchased records per customer and sequentially allocates fresh, unique contacts on repeat purchases.
- **Session & Device Security**: Device fingerprinting and session token hashing via HMAC-SHA256 with automatic session rotation.
- **Input Validation & Sanitization**: Comprehensive server-side schema validation on all endpoints with Zod and parameterized Prisma queries against SQL injection.
- **Audit Logging**: Contact viewing activity and admin operations are logged with timestamps, device details, and IP addresses.

---

## Admin Portal & Data Import

1. Access the Admin Control Center at `/admin` using your configured administrator credentials.
2. Navigate to **Excel Import** (`/admin/import`).
3. Select the target district and category, then upload your `.xlsx`, `.xls`, or `.csv` file.
4. The system validates row schemas, normalizes 10-digit mobile numbers, flags intra-file duplicates, and provides pre-import validation statistics before committing to the database.

---

## Production Deployment

1. Configure environment variables in your hosting platform (e.g., Vercel / AWS / Docker).
2. Set `NODE_ENV="production"` and `PAYMENT_MODE="razorpay"`.
3. Run migrations against your production database:
   ```bash
   npx prisma migrate deploy
   ```
4. Build the application bundle:
   ```bash
   npm run build
   npm start
   ```
