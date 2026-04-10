# Expense Management API - Response Structure

This document describes the exact API response structure for the Expense Management system.

## API Base URL

The API base URL is configured in `.env.local`:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
```

You can change this to match your backend server URL.

---

## Response Structure

All API responses follow this structure:

```typescript
{
  "success": boolean,
  "message": string,
  "data": object | array
}
```

---

## Endpoints and Response Structures

### 1. GET All Expenses
**Endpoint:** `GET /api/v1/expenses`

**Response:**
```json
{
  "success": true,
  "message": "Expenses fetched successfully",
  "data": {
    "expenses": [
      {
        "id": "uuid",
        "expenseNumber": "EX001",
        "title": "Salary",
        "description": null,
        "category": "SALARIES",
        "subCategory": null,
        "amount": 10000,
        "taxAmount": 0,
        "totalAmount": 10000,
        "expenseDate": "2026-01-17T11:19:25.000Z",
        "dueDate": null,
        "paymentDate": "2026-01-17T11:19:57.000Z",
        "paymentMethod": "CASH",
        "paymentStatus": "PAID",
        "receiptUrl": null,
        "invoiceNumber": null,
        "vendorName": null,
        "vendorContact": null,
        "departmentId": "uuid",
        "isRecurring": false,
        "recurrenceType": "MONTHLY",
        "recurrenceInterval": null,
        "nextRecurrenceDate": "2026-02-17T11:22:43.000Z",
        "budgetId": null,
        "projectId": null,
        "approvalStatus": "APPROVED",
        "approvedBy": null,
        "approvedAt": null,
        "rejectionReason": null,
        "notes": null,
        "tags": [],
        "createdBy": "Admin",
        "updatedBy": null,
        "createdAt": "2026-01-17T05:50:26.336Z",
        "updatedAt": "2026-01-17T11:19:44.000Z",
        "department": {
          "id": "uuid",
          "name": "Salary Department"
        },
        "budget": null
      }
    ],
    "pagination": {
      "total": 1,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  }
}
```

**Access in code:**
```typescript
const expenses = data?.data?.expenses || [];
const pagination = data?.data?.pagination;
```

---

### 2. POST Create Expense
**Endpoint:** `POST /api/v1/expenses`

**Response:** Same structure as GET all expenses, but returns single expense in `data` object (not in array)

---

### 3. GET Expense by ID
**Endpoint:** `GET /api/v1/expenses/{expenseId}`

**Response:**
```json
{
  "success": true,
  "message": "Expense fetched successfully",
  "data": {
    "id": "uuid",
    "expenseNumber": "EX001",
    "title": "Salary",
    // ... all expense fields
    "department": {
      "id": "uuid",
      "name": "Salary Department",
      "description": null,
      "headName": "Mr. Salary Admin",
      "headEmail": "salaryadmin@example.com",
      "headPhone": "9898989898",
      "isActive": true,
      "createdAt": "2026-01-17T05:52:04.875Z",
      "updatedAt": "2026-01-17T11:21:21.000Z"
    },
    "budget": null
  }
}
```

**Access in code:**
```typescript
const expense = data?.data;
```

---

### 4. DELETE Expense
**Endpoint:** `DELETE /api/v1/expenses/{expenseId}`

**Response:**
```json
{
  "success": true,
  "message": "Expense deleted successfully",
  "data": null
}
```

---

### 5. GET Expense Statistics
**Endpoint:** `GET /api/v1/expenses/statistics`

**Response:**
```json
{
  "success": true,
  "message": "Expense statistics fetched successfully",
  "data": {
    "totalExpenses": 1,
    "paidExpenses": 1,
    "unpaidExpenses": 0,
    "pendingApproval": 0,
    "approvedExpenses": 1,
    "rejectedExpenses": 0,
    "totalAmount": 10000,
    "paidAmount": 10000,
    "unpaidAmount": 0
  }
}
```

**Access in code:**
```typescript
const stats = data?.data;
```

---

### 6. GET Summary by Category
**Endpoint:** `GET /api/v1/expenses/summary/by-category`

**Response:**
```json
{
  "success": true,
  "message": "Expense summary by category fetched successfully",
  "data": [
    {
      "category": "SALARIES",
      "totalAmount": 10000,
      "count": 1
    }
  ]
}
```

**Access in code:**
```typescript
const categories = data?.data || [];
```

---

### 7. GET Summary by Department
**Endpoint:** `GET /api/v1/expenses/summary/by-department`

**Response:**
```json
{
  "success": true,
  "message": "Expense summary by department fetched successfully",
  "data": [
    {
      "departmentId": "uuid",
      "departmentName": "Salary Department",
      "totalAmount": 10000,
      "count": 1
    }
  ]
}
```

**Access in code:**
```typescript
const departments = data?.data || [];
```

---

### 8. GET Monthly Trends
**Endpoint:** `GET /api/v1/expenses/trends/monthly`

**Response:**
```json
{
  "success": true,
  "message": "Monthly expense trends fetched successfully",
  "data": [
    {
      "month": "01",
      "year": "2026",
      "totalAmount": 10000,
      "count": 1
    }
  ]
}
```

**Access in code:**
```typescript
const trends = data?.data || [];
```

---

### 9. GET All Budgets
**Endpoint:** `GET /api/v1/expenses/budgets/all`

**Response:**
```json
{
  "success": true,
  "message": "Budgets fetched successfully",
  "data": {
    "budgets": [
      {
        "id": "uuid",
        "name": "Q1 Budget",
        // ... budget fields
      }
    ],
    "pagination": {
      "total": 5,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  }
}
```

**Access in code:**
```typescript
const budgets = data?.data?.budgets || [];
const pagination = data?.data?.pagination;
```

---

### 10. GET All Departments
**Endpoint:** `GET /api/v1/expenses/departments/all`

**Response:**
```json
{
  "success": true,
  "message": "Departments fetched successfully",
  "data": {
    "departments": [
      {
        "id": "uuid",
        "name": "Salary Department",
        // ... department fields
      }
    ],
    "pagination": {
      "total": 3,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  }
}
```

**Access in code:**
```typescript
const departments = data?.data?.departments || [];
const pagination = data?.data?.pagination;
```

---

## Data Access Pattern

The API client (`src/lib/api/client.ts`) returns the full response object from the API. Therefore, when accessing data in components:

### For Paginated Lists:
```typescript
// Expenses
const expenses = data?.data?.expenses || [];
const pagination = data?.data?.pagination;

// Budgets
const budgets = data?.data?.budgets || [];
const pagination = data?.data?.pagination;

// Departments
const departments = data?.data?.departments || [];
const pagination = data?.data?.pagination;
```

### For Single Items:
```typescript
// Single expense
const expense = data?.data;

// Statistics
const stats = data?.data;
```

### For Arrays:
```typescript
// Categories, Departments, Trends
const categories = data?.data || [];
const departments = data?.data || [];
const trends = data?.data || [];
```

---

## Updated Files

The following files have been updated to match the exact API response structure:

1. ✅ `src/app/(dashboard)/admin/expenses/page.tsx`
   - Updated expense access: `data?.data?.expenses`
   - Updated budget access: `data?.data?.budgets`

2. ✅ `src/app/(dashboard)/admin/expenses/list/page.tsx`
   - Updated expense access: `data?.data?.expenses`

3. ✅ `src/app/(dashboard)/admin/expenses/budgets/page.tsx`
   - Updated budget access: `data?.data?.budgets`
   - Fixed Select empty string values

4. ✅ `src/app/(dashboard)/admin/expenses/departments/page.tsx`
   - Updated department access: `data?.data?.departments`

5. ✅ `.env.local`
   - Set correct API base URL

---

## Testing

To test the implementation:

1. **Start Backend Server:**
   ```bash
   # Ensure your backend is running on the configured URL
   # Default: http://localhost:5000
   ```

2. **Start Frontend:**
   ```bash
   npm run dev
   ```

3. **Test Endpoints:**
   - Navigate to `/admin/expenses` - Dashboard with statistics
   - Navigate to `/admin/expenses/list` - All expenses list
   - Navigate to `/admin/expenses/budgets` - Budget management
   - Navigate to `/admin/expenses/departments` - Department management
   - Navigate to `/admin/expenses/reports` - Analytics and reports

---

## Error Handling

All API errors are handled automatically by the React Query hooks with toast notifications.

Success responses:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error message",
  "data": null
}
```

---

## Summary

- ✅ All pages now correctly access API response data
- ✅ Fixed Select component empty string validation errors
- ✅ API base URL is configurable via environment variable
- ✅ Proper error handling with toast notifications
- ✅ Type-safe data access throughout the application

**Last Updated:** 2026-01-17  
**Status:** ✅ Complete and Tested
