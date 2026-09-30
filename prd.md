# NivoLeads — Product Requirements Document (PRD)

## 1. Executive Summary
**NivoLeads** is a dedicated B2B and commercial directory platform providing controlled, verified, in-browser access to decision-maker contact datasets across all 31 districts and 20+ industry sectors in Karnataka.

---

## 2. Core Problem Statement
1. **Low Data Quality**: Traditional lead vendors sell stale, scraped, or unverified phone lists littered with dead numbers and duplicates.
2. **Duplicate Invoicing**: In typical list buying, repeat purchases frequently contain overlapping records already paid for.
3. **Data Leakage & Piracy**: Raw Excel/CSV dumps are easily forwarded, pirated, or resold.
4. **Friction in Procurement**: Buying lists traditionally requires manual back-and-forth negotiation with middlemen.

---

## 3. Product Vision & Value Proposition
NivoLeads provides an automated, self-service marketplace where users can select their exact target district and industry, choose a desired volume, pay securely via Razorpay/UPI, and immediately explore watermarked, verified contacts in a modern, secure viewer.

### Key Value Pillars
- **100% Normalized Numbers**: Validated 10-digit mobile numbers with country code normalization.
- **Sequential Fresh Allocation**: An automated offset counter guarantees zero duplicate contacts across repeat purchases for the same account.
- **Browser-Only Secured Access**: Protected, paginated viewing environment with active deterrence against bulk copying and scraping.
- **Volume Tier Pricing**: Transparent per-contact pricing with automatic bulk volume discounts.

---

## 4. User Personas
1. **Sales & Marketing Leaders**: Need fresh calling and WhatsApp outreach datasets for outbound B2B campaigns.
2. **Distributors & Wholesalers**: Seeking local retailers, dealers, and shop owners in specific districts.
3. **Real Estate & Property Developers**: Looking for contractors, builders, and material suppliers.
4. **Agencies & Consultants**: Require targeted niche industry directories for client acquisition.
5. **Platform Administrators**: Superusers who manage district/category taxonomies, upload validated Excel sheets, configure pricing rules, and monitor platform security.

---

## 5. Functional Requirements

### 5.1 User Journey & Discovery Flow
- **Step 1 — District Selection**: User selects 1 of Karnataka's 31 districts.
- **Step 2 — Category Selection**: User selects 1 of 20+ industry categories. System displays live available contact counts and owned counts.
- **Step 3 — Quantity & Live Quote**: User enters quantity or clicks preset volume chips. Dynamic quote engine computes base price, volume discount, and final amount.
- **Step 4 — Checkout**: Seamless modal payment powered by Razorpay (UPI, Credit/Debit Cards, Net Banking).
- **Step 5 — Instant Data Unlock**: Payment confirmation immediately redirects to the interactive contact viewer.

### 5.2 Contact Allocation & Freshness Guarantee
- If a user previously purchased 100 contacts for *Vijayapura / Hospitals*, a subsequent order of 150 contacts automatically starts from Contact **#101** to **#250**.
- The system prevents re-allocating previously owned contacts to the same account.

### 5.3 Interactive Contact Viewer
- Fast search & filter by business name, area, phone number, and address.
- One-click actions: Direct Phone Call (`tel:`), Google Maps navigation, and Website visit.
- Dynamic visual watermarking displaying customer licensee identity and order ID.
- Protected clipboard and shortcut deterrence.

### 5.4 Admin Management Suite
- **Bulk Spreadsheet Importer**: Validates, normalizes, deduplicates, and commits `.xlsx`, `.xls`, and `.csv` files up to 50,000 rows.
- **Business Management**: Search, filter, edit, disable, or delete contact records.
- **Orders & Revenue Dashboard**: Real-time sales metrics, payment statuses, and customer lists.
- **Security & Audit Logs**: Contact viewing logs, session tracking, and rate limit diagnostics.

---

## 6. Non-Functional Requirements
- **Performance**: Sub-100ms API response time on cached endpoints; sub-1s cold load.
- **Reliability**: Zero data duplication; atomic database transactions for purchase allocation.
- **Accessibility & Contrast**: High-contrast light and dark mode compliant with WCAG standards.
- **Security**: Strict session hashing, rate limiting, and parameterization against injection attacks.
