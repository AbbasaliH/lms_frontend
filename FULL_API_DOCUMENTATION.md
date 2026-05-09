# Communal App / LMS — Full API Documentation

> **Base URL:** `http://localhost:7777/api/v1`  
> **Environment:** Development (`PORT=7777`)  
> **Authentication:** JWT Bearer Token (`Authorization: Bearer <token>`)  
> **Roles:** `SUPER_ADMIN`, `ADMIN`, `USER`, `DELIVERY_BOY`

---

## Table of Contents

1. [Auth & Admin Login](#1-auth--admin-login)
2. [Users](#2-users)
3. [Customer Management](#3-customer-management)
4. [Orders & Status Updates](#4-orders--status-updates)
5. [Delivery Boy](#5-delivery-boy)
6. [Inventory & Purchase](#6-inventory--purchase)
7. [Suppliers](#7-suppliers)
8. [Expenses](#8-expenses)
9. [Billing & Invoice Generation](#9-billing--invoice-generation)
10. [Services](#10-services)
11. [Subscriptions](#11-subscriptions)
12. [Payments](#12-payments)
13. [Notifications](#13-notifications)
14. [Analytics](#14-analytics)
15. [Reporting](#15-reporting)
16. [Profile](#16-profile)

---

## 1. Auth & Admin Login

### 1.1 Send OTP
- **POST** `/auth/send-otp`
- **Access:** Public
- **Body:**
```json
{ "phoneNumber": "+919999999999" }
```
- **Response 200:**
```json
{ "success": true, "message": "OTP sent successfully" }
```

### 1.2 Verify OTP
- **POST** `/auth/verify-otp`
- **Access:** Public
- **Body:**
```json
{ "phoneNumber": "+919999999999", "otp": "123456" }
```
- **Response 200:**
```json
{ "success": true, "message": "OTP verified", "data": { "token": "..." } }
```

### 1.3 Signup
- **POST** `/auth/signup`
- **Access:** Public
- **Body:**
```json
{
  "fullName": "John Doe",
  "phoneNumber": "+919999999999",
  "email": "john@example.com",
  "password": "securePass123",
  "villageName": "Green Village",
  "streetName": "Main Street"
}
```
- **Response 201:**
```json
{ "success": true, "message": "User registered", "data": { "id": "...", "token": "..." } }
```

### 1.4 Login
- **POST** `/auth/login`
- **Access:** Public
- **Body:**
```json
{ "email": "john@example.com", "password": "securePass123" }
```
- **Response 200:**
```json
{
  "success": true,
  "data": {
    "user": { "id": "...", "email": "...", "role": "USER", "fullName": "..." },
    "token": "<access_token>",
    "refreshToken": "<refresh_token>"
  }
}
```

### 1.5 Refresh Token
- **POST** `/auth/refresh`
- **Access:** Public (uses refresh token cookie/header)
- **Body:**
```json
{ "refreshToken": "<refresh_token>" }
```
- **Response 200:**
```json
{ "success": true, "data": { "token": "<new_access_token>" } }
```

### 1.6 Logout
- **POST** `/auth/logout`
- **Access:** Authenticated
- **Headers:** `Authorization: Bearer <token>`
- **Response 200:**
```json
{ "success": true, "message": "Logged out successfully" }
```

### 1.7 Get Me
- **GET** `/auth/me`
- **Access:** Authenticated
- **Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "email": "john@example.com",
    "role": "USER",
    "fullName": "John Doe",
    "phoneNumber": "+919999999999",
    "walletBalance": 0,
    "status": "APPROVED"
  }
}
```

### 1.8 Debug Token
- **GET** `/auth/debug-token`
- **Access:** Authenticated
- **Response 200:**
```json
{ "success": true, "user": { ... }, "message": "Token is valid" }
```

---

### Admin Routes (`/admin`)
*Protected by `ADMIN` role*

### 1.9 Admin Dashboard
- **GET** `/admin/dashboard`
- **Response 200:** `{ "success": true, "data": { ...dashboardStats } }`

### 1.10 Get Orders (Admin)
- **GET** `/admin/orders`
- **Response 200:** `{ "success": true, "data": { "orders": [...] } }`

### 1.11 Assign Delivery Boy
- **POST** `/admin/orders/assign`
- **Body:** `{ "orderId": "...", "deliveryBoyId": "..." }`
- **Response 200:** `{ "success": true, "message": "Assigned successfully" }`

### 1.12 Update Order Status (Admin)
- **PUT** `/admin/orders/:orderId/status`
- **Body:** `{ "status": "READY" }`
- **Response 200:** `{ "success": true, "data": { ...order } }`

### 1.13 Products CRUD (Admin)
- **GET** `/admin/products`
- **POST** `/admin/products` → Body: `{ "name": "...", "price": 99, "category": "..." }`
- **PUT** `/admin/products/:id`

### 1.14 Pending Users
- **GET** `/admin/pending-users`
- **PATCH** `/admin/users/:userId/approve`

### 1.15 Delivery Boys (Admin)
- **GET** `/admin/delivery-boys`
- **POST** `/admin/delivery-boys`

### 1.16 Client Queries
- **GET** `/admin/queries`
- **PUT** `/admin/queries/:queryId`

---

### Super Admin Routes (`/super-admin`)
*Protected by `SUPER_ADMIN` role*

### 1.17 Get Admins
- **GET** `/super-admin/admins`
- **GET** `/super-admin/admins/:adminId`
- **PUT** `/super-admin/admins/:adminId`
- **DELETE** `/super-admin/admins/:adminId`

### 1.18 Subscriptions
- **GET** `/super-admin/subscriptions`
- **POST** `/super-admin/subscriptions`
- **PUT** `/super-admin/subscriptions/:id`

### 1.19 Overview & Analytics
- **GET** `/super-admin/overview`
- **GET** `/super-admin/analytics`

### 1.20 Activity Logs
- **GET** `/super-admin/activities`

### 1.21 System Settings
- **GET** `/super-admin/settings`
- **PUT** `/super-admin/settings/:key`

---

## 2. Users

*Base prefix: `/api/v1` (mounted under `users`)*  
*Role: `USER`*

### 2.1 Create Order
- **POST** `/users/orders`
- **Body:**
```json
{
  "productId": "...",
  "addressId": "...",
  "items": [
    { "clothType": "Shirt", "quantity": 3, "addOns": ["Starch"] }
  ],
  "specialInstructions": "Handle with care"
}
```
- **Response 201:** `{ "success": true, "data": { "order": { ... } } }`

### 2.2 Get My Orders
- **GET** `/users/orders`
- **Response 200:** `{ "success": true, "data": { "orders": [...] } }`

### 2.3 Get Order by ID
- **GET** `/users/orders/:orderId`

### 2.4 Addresses
- **GET** `/users/addresses`
- **POST** `/users/addresses`
  - Body: `{ "label": "Home", "street": "...", "city": "...", "state": "...", "postalCode": "...", "isDefault": true }`
- **PUT** `/users/addresses/:addressId`

### 2.5 Wallet
- **GET** `/users/wallet`
- **Response 200:** `{ "success": true, "data": { "balance": 500 } }`

### 2.6 Wallet Top-up
- **POST** `/users/wallet/topup`
- **Body:** `{ "amount": 500 }`

### 2.7 Validate Promo Code
- **POST** `/users/promo/validate`
- **Body:** `{ "code": "SAVE20", "orderAmount": 500 }`

### 2.8 Submit Feedback
- **POST** `/users/feedback/:orderId`
- **Body:** `{ "rating": 5, "comment": "Great service!" }`

### 2.9 Update Notification Preferences
- **PUT** `/users/notifications/prefs`
- **Body:** `{ "notifyByEmail": true, "notifyBySMS": false, "notifyByPush": true }`

### 2.10 Get Products (Public)
- **GET** `/users/products`

### 2.11 Update Profile Image
- **POST** `/users/profile/image` (multipart/form-data)

### 2.12 Create Order with Photos
- **POST** `/users/orders/with-photos` (multipart/form-data + JSON fields)

---

## 3. Customer Management

*Base prefix: `/api/v1/customers`*  
*Access: Staff (`ADMIN`, `SUPER_ADMIN`, `OPERATOR`) / Admin for mutations*

### 3.1 Customer Dashboard
- **GET** `/customers/dashboard`
- **Access:** Admin/SuperAdmin

### 3.2 Top Customers
- **GET** `/customers/top-customers`

### 3.3 Customer Segments
- **GET** `/customers/segments`

### 3.4 Churn Risk Customers
- **GET** `/customers/churn-risk`

### 3.5 List Customers
- **GET** `/customers/`
- **Query:** `?status=ACTIVE&tier=GOLD&search=john&page=1&limit=10`
- **Response 200:**
```json
{
  "success": true,
  "data": {
    "customers": [
      {
        "id": "...",
        "userId": "...",
        "customerCode": "CUST-001",
        "tier": "GOLD",
        "status": "ACTIVE",
        "totalOrders": 45,
        "totalSpent": 12500,
        "user": { "fullName": "...", "email": "...", "phoneNumber": "..." }
      }
    ],
    "pagination": { "total": 100, "page": 1, "limit": 10, "totalPages": 10 }
  }
}
```

### 3.6 Get Customer by ID
- **GET** `/customers/:id`

### 3.7 Get Customer by User ID
- **GET** `/customers/user/:userId`

### 3.8 Create Customer
- **POST** `/customers/`
- **Body:**
```json
{
  "userId": "...",
  "tier": "SILVER",
  "tags": ["VIP", "Corporate"],
  "creditLimit": 5000,
  "preferredPaymentMethod": "UPI",
  "notes": "High value customer"
}
```

### 3.9 Update Customer
- **PUT** `/customers/:id`

### 3.10 Delete Customer
- **DELETE** `/customers/:id`

### 3.11 Update Customer Status
- **PATCH** `/customers/:id/status`
- **Body:** `{ "status": "SUSPENDED" }`

### 3.12 Update Customer Tier
- **PATCH** `/customers/:id/tier`
- **Body:** `{ "tier": "PLATINUM" }`

### 3.13 Verify Customer
- **PATCH** `/customers/:id/verify`
- **Body:** `{ "isVerified": true }`

### 3.14 Update Loyalty Points
- **PATCH** `/customers/:id/loyalty-points`
- **Body:** `{ "points": 100, "operation": "add" }`

### 3.15 Customer Lifetime Value
- **GET** `/customers/:customerId/ltv`

### 3.16 Interactions
- **GET** `/customers/interactions/all`
- **POST** `/customers/interactions`
  - Body: `{ "customerId": "...", "interactionType": "SUPPORT", "subject": "...", "description": "...", "priority": "HIGH" }`
- **PATCH** `/customers/interactions/:id/status`
- **PATCH** `/customers/interactions/:id/assign`

---

## 4. Orders & Status Updates

*Base prefix: `/api/v1/orders`*

### 4.1 Order Dashboard
- **GET** `/orders/dashboard`
- **Access:** Admin/SuperAdmin

### 4.2 Status Counts
- **GET** `/orders/status-counts`

### 4.3 Recent Orders
- **GET** `/orders/recent`

### 4.4 Revenue Analytics
- **GET** `/orders/revenue-analytics`

### 4.5 List Orders
- **GET** `/orders/`
- **Query:** `?userId=...&status=PENDING&fromDate=...&toDate=...&search=...&page=1&limit=10`
- **Response 200:**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "...",
        "userId": "...",
        "status": "IN_WASHING",
        "totalAmount": 450,
        "isRecurring": false,
        "createdAt": "2026-05-07T10:00:00Z",
        "user": { "fullName": "..." },
        "orderItems": [ { "clothType": "Shirt", "quantity": 3, "unitPrice": 50, "totalPrice": 150 } ]
      }
    ],
    "pagination": { "total": 50, "page": 1, "limit": 10, "totalPages": 5 }
  }
}
```

### 4.6 Get Order by ID
- **GET** `/orders/:id`

### 4.7 Create Order
- **POST** `/orders/`
- **Body:**
```json
{
  "userId": "...",
  "productId": "...",
  "addressId": "...",
  "items": [
    { "productId": "...", "clothType": "Shirt", "quantity": 2, "addOns": ["Starch"] }
  ],
  "totalAmount": 300,
  "promoCodeId": "...",
  "specialInstructions": "Deliver before 6pm"
}
```

### 4.8 Update Order
- **PUT** `/orders/:id`

### 4.9 Update Order Status
- **PATCH** `/orders/:id/status`
- **Body:** `{ "status": "DELIVERED" }`
- **Statuses:** `PENDING`, `ACCEPTED`, `PICKED_UP`, `IN_WASHING`, `READY`, `DELIVERED`, `CANCELLED`

### 4.10 Assign Delivery Boy
- **PATCH** `/orders/:id/assign-delivery-boy`
- **Body:** `{ "deliveryBoyId": "..." }`

### 4.11 Cancel Order
- **PATCH** `/orders/:id/cancel`

### 4.12 Orders by User
- **GET** `/orders/user/:userId`

### 4.13 Order Count by User
- **GET** `/orders/user/:userId/count`

### 4.14 Has Pending Orders
- **GET** `/orders/user/:userId/has-pending`

### 4.15 Orders by Delivery Boy
- **GET** `/orders/delivery-boy/:deliveryBoyId`

---

## 5. Delivery Boy

*Base prefix: `/api/v1/delivery-boy`*  
*Role: `DELIVERY_BOY`*

### 5.1 Get Assigned Orders
- **GET** `/delivery-boy/orders`
- **Response 200:**
```json
{ "success": true, "data": { "orders": [ { "id": "...", "status": "READY", "address": { ... } } ] } }
```

### 5.2 Update Order Status
- **PUT** `/delivery-boy/orders/status`
- **Body:** `{ "orderId": "...", "status": "DELIVERED" }`

### 5.3 Get Earnings
- **GET** `/delivery-boy/earnings`
- **Response 200:**
```json
{ "success": true, "data": { "totalEarnings": 5000, "todayEarnings": 350, "trips": 12 } }
```

---

## 6. Inventory & Purchase

*Base prefix: `/api/v1/inventory`*  
*Role: `ADMIN`*

### 6.1 Inventory Stats
- **GET** `/inventory/stats`

### 6.2 Low Stock Items
- **GET** `/inventory/low-stock`

### 6.3 List Inventory
- **GET** `/inventory/`
- **Response 200:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "...",
        "itemName": "Premium Detergent",
        "category": "DETERGENT",
        "quantity": 50,
        "unit": "kg",
        "minimumStock": 10,
        "status": "IN_STOCK",
        "costPerUnit": 120
      }
    ]
  }
}
```

### 6.4 Get Inventory by ID
- **GET** `/inventory/:id`

### 6.5 Create Inventory Item
- **POST** `/inventory/`
- **Body:**
```json
{
  "itemName": "Bleach Liquid",
  "description": "Industrial grade bleach",
  "category": "BLEACH",
  "quantity": 20,
  "unit": "liter",
  "minimumStock": 5,
  "reorderLevel": 10,
  "costPerUnit": 85,
  "location": "Store Room A"
}
```

### 6.6 Update Inventory Item
- **PUT** `/inventory/:id`

### 6.7 Delete Inventory Item
- **DELETE** `/inventory/:id`

### 6.8 Record Transaction
- **POST** `/inventory/transactions`
- **Body:**
```json
{
  "inventoryId": "...",
  "transactionType": "RESTOCK",
  "quantity": 50,
  "reason": "Monthly restock",
  "performedBy": "admin-user-id"
}
```

### 6.9 Transaction History
- **GET** `/inventory/:id/transactions`

### 6.10 Bulk Update Stock
- **POST** `/inventory/bulk-update`

---

## 7. Suppliers

*Base prefix: `/api/v1/suppliers`*  
*Access: `ADMIN`, `SUPER_ADMIN`*

### 7.1 Supplier Dashboard
- **GET** `/suppliers/dashboard`

### 7.2 Top Suppliers
- **GET** `/suppliers/top-suppliers`

### 7.3 List Suppliers
- **GET** `/suppliers/`
- **Query:** `?status=ACTIVE&search=...&page=1&limit=10`

### 7.4 Get Supplier by ID
- **GET** `/suppliers/:id`

### 7.5 Create Supplier
- **POST** `/suppliers/`
- **Body:**
```json
{
  "companyName": "CleanChem Supplies",
  "contactPerson": "Ramesh Kumar",
  "email": "ramesh@cleanchem.com",
  "phoneNumber": "+919999999999",
  "address": "123 Industrial Area",
  "city": "Mumbai",
  "state": "Maharashtra",
  "postalCode": "400001",
  "gstin": "27AABCU9603R1ZM",
  "supplierType": "MATERIAL",
  "categoriesSupplied": ["DETERGENT", "BLEACH"]
}
```

### 7.6 Update Supplier
- **PUT** `/suppliers/:id`

### 7.7 Delete Supplier
- **DELETE** `/suppliers/:id`

### 7.8 Verify Supplier
- **PATCH** `/suppliers/:id/verify`

### 7.9 Update Supplier Status
- **PATCH** `/suppliers/:id/status`
- **Body:** `{ "status": "ACTIVE" }`

### 7.10 Update Supplier Tier
- **PATCH** `/suppliers/:id/tier`
- **Body:** `{ "tier": "PREMIUM" }`

### 7.11 Supplier Performance
- **GET** `/suppliers/:supplierId/performance`

### 7.12 Purchase Orders
- **GET** `/suppliers/purchase-orders/all`
- **GET** `/suppliers/purchase-orders/:id`
- **POST** `/suppliers/purchase-orders`
  - Body: `{ "supplierId": "...", "expectedDelivery": "2026-05-15", "items": [...], "totalAmount": 5000, "deliveryAddress": "..." }`
- **PATCH** `/suppliers/purchase-orders/:id/status`
- **PATCH** `/suppliers/purchase-orders/:id/approve`

### 7.13 Supplier Payments
- **GET** `/suppliers/payments/all`
- **POST** `/suppliers/payments`
- **PATCH** `/suppliers/payments/:id/approve`

### 7.14 Ratings
- **POST** `/suppliers/ratings`
- **GET** `/suppliers/:supplierId/ratings`

### 7.15 Contracts
- **POST** `/suppliers/contracts`
- **PATCH** `/suppliers/contracts/:id/status`
- **GET** `/suppliers/contracts/expiring`

### 7.16 Documents
- **POST** `/suppliers/documents` (multipart/form-data)
- **PATCH** `/suppliers/documents/:id/verify`
- **GET** `/suppliers/documents/expiring`

### 7.17 Inventory Links
- **POST** `/suppliers/inventory-links`
- **GET** `/suppliers/inventory/:inventoryId/suppliers`

---

## 8. Expenses

*Base prefix: `/api/v1/expenses`*  
*Access: `ADMIN`, `SUPER_ADMIN`*

### 8.1 List Expenses
- **GET** `/expenses/`
- **Query:** `?category=RENT&status=PENDING&page=1&limit=10`
- **Response 200:**
```json
{
  "success": true,
  "data": {
    "expenses": [
      {
        "id": "...",
        "expenseNumber": "EXP-001",
        "title": "Monthly Rent",
        "category": "RENT",
        "amount": 25000,
        "paymentStatus": "PAID",
        "approvalStatus": "APPROVED",
        "expenseDate": "2026-05-01"
      }
    ]
  }
}
```

### 8.2 Expense Statistics
- **GET** `/expenses/statistics`

### 8.3 Get Expense by ID
- **GET** `/expenses/:id`

### 8.4 Create Expense
- **POST** `/expenses/`
- **Body:**
```json
{
  "title": "Electricity Bill",
  "category": "UTILITIES",
  "amount": 4500,
  "expenseDate": "2026-05-07",
  "vendorName": "MSEB",
  "invoiceNumber": "INV-2026-001",
  "departmentId": "...",
  "budgetId": "...",
  "notes": "May electricity bill"
}
```

### 8.5 Update Expense
- **PUT** `/expenses/:id`

### 8.6 Delete Expense
- **DELETE** `/expenses/:id`

### 8.7 Approve Expense
- **PATCH** `/expenses/:id/approve`

### 8.8 Reject Expense
- **PATCH** `/expenses/:id/reject`
- **Body:** `{ "rejectionReason": "Insufficient documentation" }`

### 8.9 Mark as Paid
- **PATCH** `/expenses/:id/mark-paid`

### 8.10 Summary by Category
- **GET** `/expenses/summary/by-category`

### 8.11 Summary by Department
- **GET** `/expenses/summary/by-department`

### 8.12 Monthly Trends
- **GET** `/expenses/trends/monthly`

### 8.13 Budgets
- **GET** `/expenses/budgets/all`
- **GET** `/expenses/budgets/:id`
- **POST** `/expenses/budgets`
  - Body: `{ "name": "Q2 Marketing", "category": "MARKETING", "allocatedAmount": 50000, "startDate": "...", "endDate": "..." }`
- **PUT** `/expenses/budgets/:id`
- **DELETE** `/expenses/budgets/:id`
- **GET** `/expenses/budgets/:id/utilization`

### 8.14 Departments
- **GET** `/expenses/departments/all`
- **GET** `/expenses/departments/:id`
- **POST** `/expenses/departments`
- **PUT** `/expenses/departments/:id`
- **DELETE** `/expenses/departments/:id`

---

## 9. Billing & Invoice Generation

*Base prefix: `/api/v1/billing`*

### 9.1 Billing Dashboard
- **GET** `/billing/dashboard`
- **Access:** Admin/SuperAdmin
- **Response 200:**
```json
{
  "success": true,
  "data": {
    "totalInvoices": 150,
    "totalPaid": 120,
    "totalPending": 20,
    "totalOverdue": 10,
    "totalRevenue": 250000,
    "outstandingAmount": 35000
  }
}
```

### 9.2 My Invoices (User)
- **GET** `/billing/my-invoices`
- **Access:** Any authenticated user
- **Response 200:**
```json
{
  "success": true,
  "data": {
    "invoices": [ { "id": "...", "invoiceNumber": "INV-ABC-123", "status": "PAID", "totalAmount": 450 } ],
    "pagination": { "total": 5, "page": 1, "limit": 10, "totalPages": 1 }
  }
}
```

### 9.3 List All Invoices
- **GET** `/billing/invoices`
- **Access:** Staff/Admin
- **Query:** `?userId=...&status=SENT&fromDate=...&toDate=...&search=...&page=1&limit=10`

### 9.4 Create Manual Invoice
- **POST** `/billing/invoices`
- **Access:** Admin
- **Body:**
```json
{
  "userId": "...",
  "status": "DRAFT",
  "subTotal": 500,
  "taxRate": 18,
  "taxAmount": 90,
  "discount": 0,
  "totalAmount": 590,
  "dueDate": "2026-05-15",
  "notes": "Monthly laundry charges",
  "terms": "Payment due within 7 days",
  "billingAddress": { "street": "...", "city": "..." },
  "items": [
    { "description": "Wash & Fold - Shirts", "quantity": 5, "unitPrice": 30 },
    { "description": "Dry Cleaning - Suit", "quantity": 1, "unitPrice": 350 }
  ]
}
```

### 9.5 Create Invoice from Order
- **POST** `/billing/invoices/from-order`
- **Body:** `{ "orderId": "...", "dueDate": "2026-05-15", "notes": "..." }`

### 9.6 Get Invoice by ID
- **GET** `/billing/invoices/:id`

### 9.7 Get Invoice by Number
- **GET** `/billing/invoices/number/:invoiceNumber`

### 9.8 Update Invoice
- **PUT** `/billing/invoices/:id`
- **Body:** `{ "status": "SENT", "notes": "Updated notes" }`

### 9.9 Update Invoice Status
- **PATCH** `/billing/invoices/:id/status`
- **Body:** `{ "status": "SENT" }`

### 9.10 Record Payment
- **PATCH** `/billing/invoices/:id/payment`
- **Body:** `{ "amount": 590 }`

### 9.11 Delete Invoice
- **DELETE** `/billing/invoices/:id`

### 9.12 Print / Download Invoice Data
- **GET** `/billing/invoices/:id/print`
- **Response 200:**
```json
{
  "success": true,
  "data": {
    "invoiceNumber": "INV-ABC-123",
    "issueDate": "2026-05-07T10:00:00Z",
    "dueDate": "2026-05-15",
    "status": "PAID",
    "company": { "name": "Communal Laundry Services", "gstin": "..." },
    "billTo": { "name": "...", "address": { ... } },
    "items": [ { "description": "...", "quantity": 2, "unitPrice": 50, "totalPrice": 100 } ],
    "summary": { "subTotal": 500, "taxAmount": 90, "totalAmount": 590, "paidAmount": 590, "balanceDue": 0 },
    "terms": "Payment due within 7 days"
  }
}
```

---

## 10. Services

*Base prefix: `/api/v1/services`*

### 10.1 List Services (Public)
- **GET** `/services/`
- **Response 200:**
```json
{
  "success": true,
  "data": {
    "services": [
      { "id": "...", "name": "Wash & Fold", "basePrice": 50, "category": "WASHING", "isActive": true }
    ]
  }
}
```

### 10.2 Get Service by ID (Public)
- **GET** `/services/:id`

### 10.3 Create Service
- **POST** `/services/`
- **Access:** Admin/SuperAdmin
- **Body:**
```json
{
  "name": "Premium Dry Cleaning",
  "description": "Gentle care for delicate fabrics",
  "category": "DRY_CLEANING",
  "basePrice": 200,
  "pricePerUnit": 50,
  "unitType": "piece",
  "durationHours": 48,
  "taxRate": 18
}
```

### 10.4 Update Service
- **PUT** `/services/:id`

### 10.5 Delete Service
- **DELETE** `/services/:id`

---

## 11. Subscriptions

*Base prefix: `/api/v1/subscriptions`*

### 11.1 Active Subscriptions (Public)
- **GET** `/subscriptions/active`

### 11.2 Get Subscription by ID (Public)
- **GET** `/subscriptions/:id`

### 11.3 List All Subscriptions
- **GET** `/subscriptions/`
- **Access:** Admin/SuperAdmin

### 11.4 Create Subscription
- **POST** `/subscriptions/`
- **Body:** `{ "name": "Premium Plan", "price": 999, "duration": 30, "features": ["Free pickup", "Priority washing"] }`

### 11.5 Update Subscription
- **PUT** `/subscriptions/:id`

### 11.6 Delete Subscription
- **DELETE** `/subscriptions/:id`

### 11.7 Toggle Status
- **PATCH** `/subscriptions/:id/toggle-status`

### 11.8 Assign to User
- **POST** `/subscriptions/assign`
- **Body:** `{ "userId": "...", "subscriptionId": "..." }`

### 11.9 Remove from User
- **DELETE** `/subscriptions/remove/:userId`

### 11.10 Statistics
- **GET** `/subscriptions/stats/overview`

---

## 12. Payments

*Base prefix: `/api/v1/payment`*  
*Role: `USER`*

### 12.1 Create Wallet Top-up Order
- **POST** `/payment/wallet/create-order`
- **Body:** `{ "amount": 500 }`
- **Response 200:** `{ "success": true, "data": { "id": "rzp_order_...", "amount": 50000, "currency": "INR" } }`

### 12.2 Create Order Payment
- **POST** `/payment/order/create-order`
- **Body:** `{ "orderId": "..." }`

### 12.3 Verify Client Payment
- **POST** `/payment/verify`
- **Body:**
```json
{
  "razorpay_order_id": "rzp_order_...",
  "razorpay_payment_id": "rzp_pay_...",
  "razorpay_signature": "...",
  "type": "wallet",
  "appOrderId": "...",
  "amount": 500
}
```

### 12.4 Razorpay Webhook
- **POST** `/payment/webhook`
- **Headers:** `x-razorpay-signature: ...`
- **Body:** Raw Razorpay webhook payload

---

## 13. Notifications

*Base prefix: `/api/v1/notification`*

### 13.1 Get My Notifications
- **GET** `/notification/my`
- **Response 200:**
```json
{
  "success": true,
  "data": {
    "notifications": [
      { "id": "...", "title": "Order Ready", "message": "Your order #123 is ready for delivery", "isRead": false, "type": "ORDER_UPDATE" }
    ]
  }
}
```

### 13.2 Unread Count
- **GET** `/notification/my/unread-count`
- **Response 200:** `{ "success": true, "data": { "count": 5 } }`

### 13.3 My Stats
- **GET** `/notification/my/stats`

### 13.4 Mark All as Read
- **PUT** `/notification/my/mark-all-read`

### 13.5 Get Notification by ID
- **GET** `/notification/:id`

### 13.6 Mark as Read
- **PUT** `/notification/:id/read`

### 13.7 Mark Multiple as Read
- **PUT** `/notification/mark-read`
- **Body:** `{ "ids": ["...", "..."] }`

### 13.8 Delete Notification
- **DELETE** `/notification/:id`

### 13.9 Delete Multiple
- **DELETE** `/notification/`
- **Body:** `{ "ids": ["...", "..."] }`

### 13.10 Admin: All Notifications
- **GET** `/notification/`
- **Access:** Admin/SuperAdmin

### 13.11 Admin: Create Notification
- **POST** `/notification/`
- **Body:** `{ "userId": "...", "title": "...", "message": "...", "type": "INFO", "priority": "HIGH" }`

### 13.12 Admin: Broadcast
- **POST** `/notification/broadcast`
- **Body:** `{ "title": "...", "message": "...", "type": "PROMOTION" }`

### 13.13 Test Email
- **POST** `/notification/test/email`

### 13.14 Test SMS
- **POST** `/notification/test/sms`

---

## 14. Analytics

*Base prefix: `/api/v1/analytics`*  
*Access: `ADMIN`, `SUPER_ADMIN`*

### 14.1 Overview
- **GET** `/analytics/overview?startDate=...&endDate=...`

### 14.2 Comprehensive
- **GET** `/analytics/comprehensive?startDate=...&endDate=...`

### 14.3 Revenue
- **GET** `/analytics/revenue`

### 14.4 Daily Revenue
- **GET** `/analytics/revenue/daily?days=30`

### 14.5 Orders
- **GET** `/analytics/orders`

### 14.6 Order Funnel
- **GET** `/analytics/orders/funnel`

### 14.7 Users
- **GET** `/analytics/users`

### 14.8 Products
- **GET** `/analytics/products`

### 14.9 Delivery Boys
- **GET** `/analytics/delivery-boys`

### 14.10 Feedback
- **GET** `/analytics/feedback`

### 14.11 Financial
- **GET** `/analytics/financial`

### 14.12 Geographic
- **GET** `/analytics/geographic`

### 14.13 Queries
- **GET** `/analytics/queries`

### 14.14 Subscriptions
- **GET** `/analytics/subscriptions`

---

## 15. Reporting

*Base prefix: `/api/v1/reporting`*

### 15.1 Admin Dashboard
- **GET** `/reporting/admin/dashboard`
- **Access:** `ADMIN`

### 15.2 Super Admin Dashboard
- **GET** `/reporting/superadmin/dashboard`
- **Access:** `SUPER_ADMIN`

---

## 16. Profile

*Base prefix: `/api/v1/profile`*

### 16.1 Get My Profile
- **GET** `/profile/me`
- **Access:** Any authenticated user
- **Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "USER",
    "phoneNumber": "+919999999999",
    "walletBalance": 500,
    "profileImage": "...",
    "addresses": [ ... ]
  }
}
```

---

## Common Response Patterns

### Success (200 / 201)
```json
{ "success": true, "message": "...", "data": { ... } }
```

### Error (400 / 404 / 500)
```json
{ "success": false, "error": "Error message", "errors": [] }
```

### Pagination Wrapper
```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": { "total": 100, "page": 1, "limit": 10, "totalPages": 10 }
  }
}
```

---

## Module Checklist (from Requirements)

| # | Module | Status | Base Route |
|---|--------|--------|------------|
| 1 | Admin Login Authentication | ✅ | `/auth`, `/admin`, `/super-admin` |
| 2 | Customer Management (Add/Edit/Delete) | ✅ | `/customers` |
| 3 | Order Creation & Tracking | ✅ | `/orders`, `/users/orders` |
| 4 | Inventory Purchase & Management | ✅ | `/inventory`, `/suppliers/purchase-orders` |
| 5 | Delivery Boy Assignment | ✅ | `/orders/:id/assign-delivery-boy`, `/delivery-boy` |
| 6 | Expense Tracking | ✅ | `/expenses` |
| 7 | Billing & Invoice Generation | ✅ | `/billing` |
| 8 | Status Updates (Pending, Processing, Delivered) | ✅ | `/orders/:id/status` |
