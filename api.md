# NivoLeads — REST API Specification (api.md)

## 1. Overview
All API endpoints follow RESTful conventions. Responses are returned in JSON format with standard HTTP status codes.

Base URL: `/api`

---

## 2. Authentication & Sessions

### 2.1 Register New Account
- **Endpoint**: `POST /api/auth/register`
- **Rate Limit**: 5 req/min
- **Request Body**:
  ```json
  {
    "name": "Ramesh Kumar",
    "email": "user@example.com",
    "phone": "9876543210",
    "password": "StrongPassword123"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "ok": true,
    "user": { "id": 12, "name": "Ramesh Kumar", "email": "user@example.com", "role": "CUSTOMER" }
  }
  ```

### 2.2 User Login
- **Endpoint**: `POST /api/auth/login`
- **Rate Limit**: 5 req/min
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "StrongPassword123"
  }
  ```
- **Response (200 OK)**: Sets `httpOnly` session cookie `kbd_session`.
  ```json
  {
    "ok": true,
    "role": "CUSTOMER"
  }
  ```

### 2.3 User Logout
- **Endpoint**: `POST /api/auth/logout`
- **Response (200 OK)**: Clears `kbd_session` cookie.

---

## 3. Catalog & Discovery

### 3.1 Fetch Categories & Availability Counts
- **Endpoint**: `GET /api/catalog/categories?district=vijayapura`
- **Query Params**:
  - `district` (string, required): District slug (e.g., `"vijayapura"`).
- **Response (200 OK)**:
  ```json
  [
    {
      "id": 1,
      "name": "Hospitals & Clinics",
      "slug": "hospitals-clinics",
      "icon": "🏥",
      "count": 500,
      "available": 400,
      "purchased": 100
    }
  ]
  ```

### 3.2 Real-Time Price & Volume Quote
- **Endpoint**: `GET /api/quote?district=vijayapura&category=hospitals-clinics&qty=100`
- **Query Params**:
  - `district` (string, required)
  - `category` (string, required)
  - `qty` (number, required)
- **Response (200 OK)**:
  ```json
  {
    "district": { "id": 15, "name": "Vijayapura" },
    "category": { "id": 1, "name": "Hospitals & Clinics" },
    "quantity": 100,
    "ratePaise": 200,
    "basePaise": 20000,
    "discountPercent": 10,
    "discountPaise": 2000,
    "finalPaise": 18000,
    "totalInCategory": 500,
    "available": 400,
    "alreadyPurchased": 100,
    "nextStartNumber": 101,
    "exceeds": false
  }
  ```

---

## 4. Orders & Payments

### 4.1 Create Razorpay Order
- **Endpoint**: `POST /api/orders`
- **Auth**: Required (Customer session)
- **Request Body**:
  ```json
  {
    "districtId": 15,
    "categoryId": 1,
    "quantity": 100
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "orderId": "order_Rzp1234567890",
    "keyId": "rzp_test_xxxxxxxx",
    "amountPaise": 18000,
    "quantity": 100,
    "code": "PUR-987XYZ",
    "prefill": {
      "name": "Ramesh Kumar",
      "email": "user@example.com",
      "contact": "9876543210"
    }
  }
  ```

### 4.2 Verify Payment & Allocate Contacts
- **Endpoint**: `POST /api/orders/verify`
- **Auth**: Required
- **Request Body**:
  ```json
  {
    "purchaseCode": "PUR-987XYZ",
    "razorpayOrderId": "order_Rzp1234567890",
    "razorpayPaymentId": "pay_Rzp1234567890",
    "razorpaySignature": "3e9b...hmac_sha256_signature..."
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "ok": true,
    "purchaseId": 42,
    "allocated": 100,
    "startOffset": 101,
    "endOffset": 200
  }
  ```

---

## 5. Protected Contact Viewer

### 5.1 Retrieve Purchased Contacts
- **Endpoint**: `GET /api/purchases/:id/contacts?page=1&q=apollo`
- **Auth**: Required (Must own purchase `:id`)
- **Query Params**:
  - `page` (number, default: 1)
  - `q` (string, optional): Search keyword
- **Response (200 OK)**:
  ```json
  {
    "page": 1,
    "pages": 5,
    "total": 100,
    "startOffset": 101,
    "endOffset": 200,
    "items": [
      {
        "id": 892,
        "sequenceNumber": 101,
        "name": "Apollo Clinic",
        "phone": "9880123456",
        "altPhone": "08352223344",
        "email": "contact@apolloclinic.com",
        "website": "https://apolloclinic.com",
        "area": "Station Road",
        "pincode": "586101",
        "address": "Opposite City Bus Stand, Station Road",
        "mapsUrl": "https://maps.google.com/?q=Apollo+Clinic+Vijayapura"
      }
    ]
  }
  ```

---

## 6. Admin Endpoints

### 6.1 Bulk Spreadsheet Import
- **Endpoint**: `POST /api/admin/import`
- **Auth**: Required (Role: `ADMIN`)
- **Payload**: `FormData` containing `file` (`.xlsx/.xls/.csv`), `districtId`, `categoryId`, and `action` (`"validate"` | `"import"`).
- **Response (200 OK)**:
  ```json
  {
    "action": "import",
    "summary": {
      "total": 500,
      "valid": 480,
      "duplicates": 15,
      "invalid": 5,
      "newRecords": 450,
      "existingToUpdate": 30
    },
    "imported": 450,
    "updated": 30
  }
  ```
