# LeadSetu — Database Schema & Architecture (database.md)

## 1. Overview
LeadSetu uses a relational MySQL database (InnoDB engine, `utf8mb4_unicode_ci` collation) managed declaratively via Prisma ORM.

---

## 2. Entity Relationship Model

```
+----------------+          +-------------------+          +-----------------+
|    District    |          |     Business      |          |    Category     |
+----------------+          +-------------------+          +-----------------+
| id (PK)        |<---------| districtId (FK)   |--------->| id (PK)         |
| name           |          | categoryId (FK)   |          | name            |
| slug (UQ)      |          | name              |          | slug (UQ)       |
| sortOrder      |          | phone             |          | icon            |
+----------------+          | altPhone          |          | sortOrder       |
                            | email             |          +-----------------+
                            | website           |                   ^
                            | area              |                   |
                            | pincode           |                   |
                            | address           |                   |
                            | mapsUrl           |                   |
                            | status            |                   |
                            +-------------------+                   |
                                      ^                             |
                                      |                             |
+----------------+          +-------------------+                   |
|      User      |          |  PurchaseContact  |                   |
+----------------+          +-------------------+                   |
| id (PK)        |<---------| purchaseId (FK)   |                   |
| email (UQ)     |          | businessId (FK)   |                   |
| passwordHash   |          | sequenceNo        |                   |
| role           |          +-------------------+                   |
| createdAt      |                    |                             |
+----------------+                    v                             |
        |                   +-------------------+                   |
        |                   |     Purchase      |                   |
        |                   +-------------------+                   |
        +------------------>| userId (FK)       |                   |
                            | districtId (FK)   |-------------------+
                            | categoryId (FK)   |
                            | quantity          |
                            | amountPaise       |
                            | status (PAID, ...) |
                            | code (UQ)         |
                            +-------------------+
```

---

## 3. Detailed Table Specifications

### 3.1 `districts`
Stores Karnataka's 31 administrative districts.
- `id`: `INT AUTO_INCREMENT PRIMARY KEY`
- `name`: `VARCHAR(100) NOT NULL` (e.g., "Vijayapura", "Bengaluru Urban")
- `slug`: `VARCHAR(100) UNIQUE NOT NULL` (e.g., "vijayapura", "bengaluru-urban")
- `sortOrder`: `INT DEFAULT 0`

### 3.2 `categories`
Stores business industry sectors.
- `id`: `INT AUTO_INCREMENT PRIMARY KEY`
- `name`: `VARCHAR(100) NOT NULL` (e.g., "Hospitals & Clinics", "Real Estate & Builders")
- `slug`: `VARCHAR(100) UNIQUE NOT NULL`
- `icon`: `VARCHAR(10) NOT NULL` (Emoji or icon identifier)
- `sortOrder`: `INT DEFAULT 0`

### 3.3 `businesses`
Stores verified B2B and retail business contact records.
- `id`: `BIGINT AUTO_INCREMENT PRIMARY KEY`
- `districtId`: `INT NOT NULL` (FK -> `districts.id`)
- `categoryId`: `INT NOT NULL` (FK -> `categories.id`)
- `name`: `VARCHAR(255) NOT NULL`
- `phone`: `VARCHAR(20) NOT NULL` (Normalized 10-digit mobile number)
- `altPhone`: `VARCHAR(50) NULL`
- `email`: `VARCHAR(255) NULL`
- `website`: `VARCHAR(255) NULL`
- `area`: `VARCHAR(150) NULL`
- `pincode`: `VARCHAR(10) NULL`
- `address`: `TEXT NULL`
- `mapsUrl`: `VARCHAR(500) NULL`
- `status`: `ENUM('ACTIVE', 'DISABLED') DEFAULT 'ACTIVE'`
- **Indexes**:
  - `@@unique([districtId, categoryId, phone])` (Prevents duplicate numbers in the same district and sector).
  - `@@index([districtId, categoryId, status])` (Optimizes discovery count queries).

### 3.4 `users`
Customer and administrator accounts.
- `id`: `INT AUTO_INCREMENT PRIMARY KEY`
- `name`: `VARCHAR(150) NOT NULL`
- `email`: `VARCHAR(255) UNIQUE NOT NULL`
- `phone`: `VARCHAR(20) NULL`
- `passwordHash`: `VARCHAR(255) NOT NULL` (Bcrypt hash)
- `role`: `ENUM('CUSTOMER', 'ADMIN') DEFAULT 'CUSTOMER'`
- `createdAt`: `DATETIME DEFAULT CURRENT_TIMESTAMP`

### 3.5 `user_sessions`
Active device sessions.
- `id`: `INT AUTO_INCREMENT PRIMARY KEY`
- `userId`: `INT NOT NULL` (FK -> `users.id`)
- `tokenHash`: `VARCHAR(64) UNIQUE NOT NULL` (HMAC-SHA256 of session cookie)
- `device`: `VARCHAR(255) NOT NULL`
- `ipAddress`: `VARCHAR(45) NOT NULL`
- `lastActive`: `DATETIME DEFAULT CURRENT_TIMESTAMP`
- `expiresAt`: `DATETIME NOT NULL`

### 3.6 `pricing_rules`
Volume tier pricing rules.
- `id`: `INT AUTO_INCREMENT PRIMARY KEY`
- `districtId`: `INT NULL` (NULL = global fallback)
- `categoryId`: `INT NULL` (NULL = global fallback)
- `minQuantity`: `INT NOT NULL`
- `ratePaise`: `INT NOT NULL` (Per-contact price in paise)
- `discountPercent`: `INT DEFAULT 0`

### 3.7 `purchases`
Customer purchase transactions.
- `id`: `BIGINT AUTO_INCREMENT PRIMARY KEY`
- `code`: `VARCHAR(32) UNIQUE NOT NULL` (e.g., "PUR-ABC123XYZ")
- `userId`: `INT NOT NULL` (FK -> `users.id`)
- `districtId`: `INT NOT NULL` (FK -> `districts.id`)
- `categoryId`: `INT NOT NULL` (FK -> `categories.id`)
- `quantity`: `INT NOT NULL`
- `amountPaise`: `INT NOT NULL`
- `status`: `ENUM('PENDING', 'PAID', 'FAILED', 'REFUNDED') DEFAULT 'PENDING'`
- `razorpayOrderId`: `VARCHAR(100) NULL`
- `razorpayPaymentId`: `VARCHAR(100) NULL`
- `createdAt`: `DATETIME DEFAULT CURRENT_TIMESTAMP`

### 3.8 `purchase_contacts`
Allocated business contacts linked to a specific purchase.
- `id`: `BIGINT AUTO_INCREMENT PRIMARY KEY`
- `purchaseId`: `BIGINT NOT NULL` (FK -> `purchases.id`)
- `businessId`: `BIGINT NOT NULL` (FK -> `businesses.id`)
- `sequenceNumber`: `INT NOT NULL` (Offset position, e.g., 101, 102)
- **Indexes**:
  - `@@unique([purchaseId, businessId])`
  - `@@index([purchaseId, sequenceNumber])`

### 3.9 `contact_views`
Audit access log for security compliance.
- `id`: `BIGINT AUTO_INCREMENT PRIMARY KEY`
- `userId`: `INT NOT NULL`
- `purchaseId`: `BIGINT NOT NULL`
- `page`: `INT NOT NULL`
- `ipAddress`: `VARCHAR(45) NOT NULL`
- `userAgent`: `VARCHAR(255) NOT NULL`
- `viewedAt`: `DATETIME DEFAULT CURRENT_TIMESTAMP`
