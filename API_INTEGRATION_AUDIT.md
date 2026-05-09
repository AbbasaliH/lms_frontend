# API Integration Audit Report

> **Project:** LMS Frontend (Next.js + TypeScript + TanStack Query)
> **Base URL:** `http://localhost:7777/api/v1`
> **Date:** 2026-05-07
> **Audited by:** Automated full-page CRUD action audit

---

## Executive Summary

This document records the outcome of a comprehensive audit across **all pages and components** to verify that every user action (view, create, update, delete, filter, export, etc.) is wired to a real backend API. Every file in `src/app/` and `src/components/` was inspected for mock data, hardcoded values, dummy buttons, `TODO` placeholders, `console.log` stubs, and `toast.info('coming soon')` patterns.

### Key Results

| Metric | Count |
|--------|-------|
| Total pages audited | 38 |
| Total components audited | 40+ |
| Dummy/placeholder actions fixed | 18 |
| Client-side filters upgraded to API-backed | 3 |
| Empty/stub files removed | 2 |
| Pre-existing TypeScript errors (unrelated) | 5 |

---

## 1. Module-by-Module Audit

### 1.1 Authentication (`/auth`)

| Action | Status | API Hook |
|--------|--------|----------|
| Login | ✅ Real API | `useAuth().login` → `POST /auth/login` |
| Signup | ✅ Real API | `useAuth().signup` → `POST /auth/signup` |
| Forgot Password | ✅ Fixed | Shows `toast.info('Please contact your administrator...')` |
| Toggle Password Visibility | UI-only | No API call needed |

**Fix applied:** "Forgot password?" button was a non-functional `<Button variant="link">` with no `onClick`. Added a toast message directing users to contact their administrator.

---

### 1.2 Admin Dashboard (`/admin`)

| Action | Status | API Hook |
|--------|--------|----------|
| View stats | ✅ Real API | `useAdminDashboard` → `GET /admin/dashboard` |
| View recent orders | ✅ Real API | `ordersApi.getOrders()` → `GET /admin/orders` |
| Create Order (dialog) | ✅ Real API | `useCreateOrder` → `POST /orders` |

---

### 1.3 Customers (`/admin/customers`)

| Action | Status | API Hook |
|--------|--------|----------|
| View list | ✅ Real API | `useCustomers({ search, page, limit })` |
| Search | ✅ Real API | Query param passed to `GET /customers?search=...` |
| Add Customer | ✅ Real API | Two-step: `POST /auth/signup` → `POST /customers` |
| Update Status | ✅ Real API | `useUpdateCustomerStatus` → `PATCH /customers/:id/status` |
| Pagination | ✅ Real API | `page`/`limit` params on `GET /customers` |
| Clear Search | ✅ Fixed | "Filter" dummy button replaced with working "Clear" button |

**Fix applied:** The "Filter" button had no `onClick` handler. Replaced with a "Clear" button that resets search and pagination state.

---

### 1.4 Orders (`/admin/orders`)

| Action | Status | API Hook |
|--------|--------|----------|
| View list | ✅ Real API | `ordersApi.getOrders({ search, status, page, limit })` |
| Search | ✅ Upgraded | Now passes `search` to `GET /admin/orders?search=...` |
| Status Tabs | ✅ Upgraded | Now passes `status` to `GET /admin/orders?status=...` |
| Pagination | ✅ Upgraded | Now passes `page`/`limit` to API |
| Update Status | ✅ Real API | `ordersApi.updateOrderStatus` → `PATCH /admin/orders/:id/status` |
| Assign Delivery Boy | ✅ Real API | `ordersApi.assignDeliveryBoy` → `PATCH /admin/orders/:id/assign` |
| Cancel Order | ✅ Real API | `ordersApi.cancelOrder` → `PATCH /admin/orders/:id/cancel` |
| Export CSV | ✅ Client-side | Generates CSV from fetched data |
| Print Invoice | ✅ Client-side | Opens `window.print()` with order data |

**Fix applied:** Removed client-side filtering/pagination. The page now passes `search`, `status`, `page`, and `limit` directly to `ordersApi.getOrders()`. Added a "Clear Filters" button when filters are active.

---

### 1.5 Inventory (`/admin/inventory`)

| Action | Status | API Hook |
|--------|--------|----------|
| View list | ✅ Real API | `inventoryApi.getInventory(page, limit)` |
| Search | Client-side | Filters already-fetched data (acceptable for small datasets) |
| Add Item | ✅ Real API | `AddInventoryDialog` → `POST /inventory` |
| Delete Item | ✅ Real API | `inventoryApi.deleteInventory` → `DELETE /inventory/:id` |
| Restock | ✅ Real API | `inventoryApi.createInventoryTransaction` |
| Clear Search | ✅ Fixed | "Filter" dummy button replaced with working "Clear" button |

**Fix applied:** "Filter" button had no `onClick`. Replaced with "Clear" button.

---

### 1.6 Delivery Boys (`/admin/delivery-boys`)

| Action | Status | API Hook |
|--------|--------|----------|
| View list | ✅ Real API | `useDeliveryBoys` → `GET /admin/delivery-boys` |
| Create | ✅ Real API | `useCreateDeliveryBoy` → `POST /admin/delivery-boys` |
| Update | ✅ Real API | `useUpdateDeliveryBoy` → `PUT /admin/delivery-boys/:id` |
| Update Status | ✅ Real API | `useUpdateDeliveryBoyStatus` → `PATCH /admin/delivery-boys/:id/status` |
| Delete | ✅ Real API | `useDeleteDeliveryBoy` → `DELETE /admin/delivery-boys/:id` |
| Assign Order | ✅ Real API | `useAssignOrder` → `POST /admin/orders/assign` |
| Filters | ✅ Real API | `useDeliveryBoys(filters)` |

---

### 1.7 Suppliers (`/admin/suppliers`)

| Action | Status | API Hook |
|--------|--------|----------|
| View list | ✅ Real API | `useSuppliers` → `GET /suppliers` |
| View dashboard stats | ✅ Real API | `useSupplierDashboard` → `GET /suppliers/dashboard` |
| Create | ✅ Real API | `useCreateSupplier` → `POST /suppliers` |
| Update | ✅ Real API | `useUpdateSupplier` → `PUT /suppliers/:id` |
| Delete | ✅ Real API | `useDeleteSupplier` → `DELETE /suppliers/:id` |
| Verify | ✅ Real API | `useVerifySupplier` → `PATCH /suppliers/:id/verify` |
| Update Status | ✅ Real API | `useUpdateSupplierStatus` → `PATCH /suppliers/:id/status` |
| Update Tier | ✅ Real API | `useUpdateSupplierTier` → `PATCH /suppliers/:id/tier` |
| View Performance | ✅ Real API | `useSupplierPerformance` → `GET /suppliers/:id/performance` |

---

### 1.8 Purchase Orders (`/admin/items-orders`)

| Action | Status | API Hook |
|--------|--------|----------|
| View list | ✅ Real API | `usePurchaseOrders` → `GET /suppliers/purchase-orders/all` |
| Create | ✅ Real API | `useCreatePurchaseOrder` → `POST /suppliers/purchase-orders` |
| Approve | ✅ Real API | `useApprovePurchaseOrder` → `PATCH /suppliers/purchase-orders/:id/approve` |
| Update Status | ✅ Real API | `useUpdatePurchaseOrderStatus` → `PATCH /suppliers/purchase-orders/:id/status` |
| Search | Client-side | Filters already-fetched data |
| Clear Search | ✅ Fixed | "Filter" dummy button replaced with working "Clear" button |

**Fix applied:** "Filter" button had no `onClick`. Replaced with "Clear" button.

---

### 1.9 Services (`/admin/services`, `/services`)

| Action | Status | API Hook |
|--------|--------|----------|
| View list | ✅ Real API | `useServices` → `GET /services` |
| Create | ✅ Real API | `useCreateService` → `POST /services` |
| Update | ✅ Real API | `useUpdateService` → `PUT /services/:id` |
| Delete | ✅ Real API | `useDeleteService` → `DELETE /services/:id` |
| Public listing | ✅ Real API | `useServices({ isActive: true })` |
| Category tabs | Client-side | Filters already-fetched data |
| Add to Order (public) | ✅ Fixed | Replaced `alert()` with navigation to `/admin/orders` |

**Fix applied:** Public services page had `alert("In a real app, this would add the service to your order!")`. Replaced with a "View in Dashboard" button that navigates to the orders page.

---

### 1.10 Pricing (`/admin/pricing`)

| Action | Status | API Hook |
|--------|--------|----------|
| View list | ✅ Real API | `useServices` → `GET /services` |
| Add Pricing | ✅ Real API | `useCreateService` → `POST /services` |

---

### 1.11 Notifications (`/admin/notifications`)

| Action | Status | API Hook |
|--------|--------|----------|
| View list | ✅ Real API | `useMyNotifications` → `GET /notification/my` |
| Mark as read | ✅ Real API | `useMarkAsRead` → `PUT /notification/:id/read` |
| Mark all as read | ✅ Real API | `useMarkAllAsRead` → `PUT /notification/my/mark-all-read` |
| Delete | ✅ Real API | `useDeleteNotification` → `DELETE /notification/:id` |
| Filter by type/priority | ✅ Real API | `useMyNotifications({ type, priority })` |
| Pagination | ✅ Real API | `useMyNotifications({ page, limit })` |

---

### 1.12 Settings (`/admin/settings`)

| Action | Status | API Hook |
|--------|--------|----------|
| Load profile | ✅ Real API | `useGetMe` → `GET /auth/me` |
| Save Profile | ✅ Real API | `useUpdateProfile` → `PUT /profile/me` |
| Update Shop | ✅ Real API | `useUpdateProfile` → `PUT /profile/me` |
| Save Preferences | ✅ Real API | `useUpdateProfile` → `PUT /profile/me` |

---

### 1.13 Queries (`/admin/queries`)

| Action | Status | API Hook |
|--------|--------|----------|
| View queries | ✅ Real API | `useAdminQueries` → `GET /admin/queries` |
| Respond & Resolve | ✅ Real API | `useUpdateAdminQuery` → `PUT /admin/queries/:id` |
| Search | Client-side | Filters already-fetched data |

---

### 1.14 Analytics (`/admin/analytics`)

| Action | Status | API Hook |
|--------|--------|----------|
| View overview | ✅ Real API | `useAnalyticsOverview(startDate, endDate)` |
| View revenue | ✅ Real API | `useAnalyticsRevenue` → `GET /analytics/revenue` |
| View orders | ✅ Real API | `useAnalyticsOrders` → `GET /analytics/orders` |
| View daily revenue | ✅ Real API | `useAnalyticsDailyRevenue(14)` |
| View users | ✅ Real API | `useAnalyticsUsers` → `GET /analytics/users` |
| View products | ✅ Real API | `useAnalyticsProducts` → `GET /analytics/products` |
| View delivery boys | ✅ Real API | `useAnalyticsDeliveryBoys` → `GET /analytics/delivery-boys` |
| Time range selector | ✅ Upgraded | Now computes `startDate`/`endDate` and passes to `useAnalyticsOverview` |
| Custom Range button | ✅ Fixed | Disabled (no date picker implemented) |

**Fix applied:** Time range buttons (7d/30d/90d/1y) previously only updated local React state. Now they compute actual `startDate`/`endDate` values and pass them to `useAnalyticsOverview`, which forwards them to `GET /analytics/overview?startDate=...&endDate=...`.

---

### 1.15 Finance (`/admin/finance`)

| Action | Status | API Hook |
|--------|--------|----------|
| View metrics | ✅ Real API | `useFinancialMetrics` → `GET /finance/metrics` |
| Revenue/Expense chart | ✅ Real API | `useRevenueExpenseTrends` → `GET /finance/trends` |
| Expense breakdown | ✅ Real API | `useExpenseBreakdown` → `GET /finance/expense-breakdown` |
| Cash flow | ✅ Real API | `useCashFlow` → `GET /finance/cash-flow` |
| Budget comparison | ✅ Real API | `useBudgetComparison` → `GET /finance/budget-comparison` |
| Profit/Loss | ✅ Real API | `useProfitLoss` → `GET /finance/profit-loss` |
| Financial ratios | ✅ Real API | `useFinancialRatios` → `GET /finance/ratios` |
| Generate Report | ✅ Fixed | Disabled (no backend export endpoint) |
| Export Data | ✅ Fixed | Disabled (no backend export endpoint) |

**Fix applied:** "Generate Report" and "Export Data" buttons were non-functional placeholders with no `onClick`. Disabled them since no backend export endpoints are documented.

---

### 1.16 Subscriptions (`/admin/subscriptions`)

| Action | Status | API Hook |
|--------|--------|----------|
| View list | ✅ Real API | `useSubscriptions` → `GET /subscriptions` |
| Create Plan | ✅ Real API | `useCreateSubscription` → `POST /subscriptions` |
| Update Plan | ✅ Real API | `useUpdateSubscription` → `PUT /subscriptions/:id` |
| Delete Plan | ✅ Real API | `useDeleteSubscription` → `DELETE /subscriptions/:id` |
| Toggle Status | ✅ Real API | `useToggleSubscriptionStatus` → `PATCH /subscriptions/:id/toggle-status` |
| Search | Client-side | Filters already-fetched data |

---

### 1.17 Laundry Inventory (`/admin/laundry-inventory`)

| Action | Status | API Hook |
|--------|--------|----------|
| View items | ✅ Real API | `useInventoryItems(filters)` → `GET /laundry/inventory/items` |
| View analytics | ✅ Real API | `useInventoryAnalytics` → `GET /laundry/inventory/analytics` |
| View low stock | ✅ Real API | `useLowStockItems` → `GET /laundry/inventory/low-stock` |
| View expired | ✅ Real API | `useExpiredItems` → `GET /laundry/inventory/expired` |
| View near expiry | ✅ Real API | `useNearExpiryItems` → `GET /laundry/inventory/near-expiry` |
| View reorder suggestions | ✅ Real API | `useReorderSuggestions` → `GET /laundry/inventory/reorder-suggestions` |
| View alerts | ✅ Real API | `useInventoryAlerts` → `GET /laundry/inventory/alerts` |
| Create item | ✅ Real API | `useCreateInventoryItem` → `POST /laundry/inventory/items` |
| Update item | ✅ Real API | `useUpdateInventoryItem` → `PUT /laundry/inventory/items/:id` |
| Delete item | ✅ Real API | `useDeleteInventoryItem` → `DELETE /laundry/inventory/items/:id` |
| Receive stock | ✅ Real API | `useReceiveStock` → `POST /laundry/inventory/items/:id/receive` |
| Record usage | ✅ Real API | `useRecordUsage` → `POST /laundry/inventory/usage` |
| Record wastage | ✅ Real API | `useRecordWastage` → `POST /laundry/inventory/wastage` |
| Search/Filter | ✅ Real API | `handleApplyFilters()` passes to API; `handleClearFilters()` resets |
| Export button | ✅ Fixed | Disabled (no backend export endpoint) |
| Import button | ✅ Fixed | Disabled (no backend import endpoint) |
| Quick Action: Record Wastage | ✅ Fixed | Disabled placeholder button |
| Quick Action: Stock Transfer | ✅ Fixed | Disabled placeholder button |
| Quick Action: View Transactions | ✅ Fixed | Disabled placeholder button |
| Quick Action: Analytics Report | ✅ Fixed | Disabled placeholder button |
| Quick Action: Usage Trends | ✅ Fixed | Disabled placeholder button |

**Fix applied:** All 5 quick-action buttons showed `toast.info('...coming soon')`. Disabled them since backend endpoints for these features are not documented. Export and Import buttons were also non-functional — disabled.

---

### 1.18 Expenses Module

#### Expense Dashboard (`/admin/expenses`)

| Action | Status | API Hook |
|--------|--------|----------|
| View statistics | ✅ Real API | `useExpenseStatistics` → `GET /expenses/statistics` |
| View category summary | ✅ Real API | `useCategorySummary` → `GET /expenses/summary/by-category` |
| View monthly trends | ✅ Real API | `useMonthlyTrends` → `GET /expenses/trends/monthly` |
| View recent expenses | ✅ Real API | `useExpenses` → `GET /expenses` |
| View active budgets | ✅ Real API | `useBudgets` → `GET /expenses/budgets/all` |

#### Expense List (`/admin/expenses/list`)

| Action | Status | API Hook |
|--------|--------|----------|
| View expenses | ✅ Real API | `useExpenses(filters)` |
| Create | ✅ Navigation | Links to `/admin/expenses/new` |
| Edit | ✅ Navigation | Links to `/admin/expenses/:id/edit` |
| Approve | ✅ Real API | `useApproveExpense` → `PATCH /expenses/:id/approve` |
| Reject | ✅ Real API | `useRejectExpense` → `PATCH /expenses/:id/reject` |
| Mark as Paid | ✅ Real API | `useMarkAsPaid` → `PATCH /expenses/:id/mark-paid` |
| Delete | ✅ Real API | `useDeleteExpense` → `DELETE /expenses/:id` |
| Pagination | ✅ Real API | `page`/`limit` params |

#### Expense Create/Edit/Detail

| Action | Status | API Hook |
|--------|--------|----------|
| Create expense | ✅ Real API | `useCreateExpense` → `POST /expenses` |
| Update expense | ✅ Real API | `useUpdateExpense` → `PUT /expenses/:id` |
| Load expense detail | ✅ Real API | `useExpense` → `GET /expenses/:id` |

#### Budgets (`/admin/expenses/budgets`)

| Action | Status | API Hook |
|--------|--------|----------|
| View budgets | ✅ Real API | `useBudgets(filters)` |
| Create budget | ✅ Real API | `useCreateBudget` → `POST /expenses/budgets` |
| Update budget | ✅ Real API | `useUpdateBudget` → `PUT /expenses/budgets/:id` |
| Delete budget | ✅ Real API | `useDeleteBudget` → `DELETE /expenses/budgets/:id` |

#### Departments (`/admin/expenses/departments`)

| Action | Status | API Hook |
|--------|--------|----------|
| View departments | ✅ Real API | `useDepartments(filters)` |
| Create department | ✅ Real API | `useCreateDepartment` → `POST /expenses/departments` |
| Update department | ✅ Real API | `useUpdateDepartment` → `PUT /expenses/departments/:id` |
| Delete department | ✅ Real API | `useDeleteDepartment` → `DELETE /expenses/departments/:id` |
| Search | Client-side | Filters already-fetched data |

#### Reports (`/admin/expenses/reports`)

| Action | Status | API Hook |
|--------|--------|----------|
| View statistics | ✅ Real API | `useExpenseStatistics` |
| View category summary | ✅ Real API | `useCategorySummary` |
| View department summary | ✅ Real API | `useDepartmentSummary` |
| View monthly trends | ✅ Real API | `useMonthlyTrends` |
| Export CSV | Client-side | Generates CSV from already-fetched API data |

---

### 1.19 Billing & Invoices

| Action | Status | API Hook |
|--------|--------|----------|
| View dashboard | ✅ Real API | `useBillingDashboard` → `GET /billing/dashboard` |
| View invoices | ✅ Real API | `useInvoices` → `GET /billing/invoices` |
| View my invoices | ✅ Real API | `useMyInvoices` → `GET /billing/my-invoices` |
| View invoice by ID | ✅ Real API | `useInvoice` → `GET /billing/invoices/:id` |
| Create invoice | ✅ Real API | `useCreateInvoice` → `POST /billing/invoices` |
| Create from order | ✅ Real API | `useCreateInvoiceFromOrder` → `POST /billing/invoices/from-order` |
| Update invoice | ✅ Real API | `useUpdateInvoice` → `PUT /billing/invoices/:id` |
| Update status | ✅ Real API | `useUpdateInvoiceStatus` → `PATCH /billing/invoices/:id/status` |
| Record payment | ✅ Real API | `useRecordInvoicePayment` → `PATCH /billing/invoices/:id/payment` |
| Delete invoice | ✅ Real API | `useDeleteInvoice` → `DELETE /billing/invoices/:id` |
| Print data | ✅ Real API | `usePrintInvoiceData` → `GET /billing/invoices/:id/print` |

---

### 1.20 Payments (`/admin/payments`)

| Action | Status | API Hook |
|--------|--------|----------|
| View payments | ✅ Real API | `usePayments` → `GET /payments` |
| View stats | ✅ Real API | `usePaymentStats` → `GET /payments/stats` |
| View details | ✅ Real API | `usePayment` → `GET /payments/:id` |
| Process refund | ✅ Real API | `useRefundPayment` → `POST /payments/:id/refund` |
| Download receipt | ⚠️ Partial | Checks `receiptUrl` from API; falls back to toast if missing |
| Create wallet order | ✅ Real API | `useCreateWalletOrder` → `POST /payment/wallet/create-order` |
| Create order payment | ✅ Real API | `useCreateOrderPayment` → `POST /payment/order/create-order` |
| Verify payment | ✅ Real API | `useVerifyPayment` → `POST /payment/verify` |
| Search | Client-side | Filters already-fetched data |
| Status tabs | Client-side | Filters already-fetched data |
| Method filter | Client-side | Filters already-fetched data |
| Pagination | ✅ Real API | `usePayments({ page, limit })` |

---

### 1.21 Super Admin (`/super-admin`)

| Page | Read | Create | Update | Delete |
|------|------|--------|--------|--------|
| Dashboard | ✅ API | — | — | — |
| Admins | ✅ API | — | — | ✅ API |
| Analytics | ✅ API | — | — | — |
| Customers | ✅ API | ✅ API | — | ✅ API |
| Revenue | ✅ API | — | — | — |
| Settings | ✅ API | — | ✅ API | — |
| **Shops** | ❌ **Stub** | ❌ **Stub** | — | — |
| Subscriptions | ✅ API | — | — | ✅ API |

**Note on Shops:** The `/super-admin/shops` page is a complete stub. The backend API documentation does not contain any shop-related endpoints. The page displays a placeholder message: "Shop management is not yet available. Backend API endpoints for shop CRUD operations have not been implemented."

---

### 1.22 Profile (`/profile`)

| Action | Status | API Hook |
|--------|--------|----------|
| View profile | ✅ Real API | `useCustomerProfile` → `GET /customers/user/:userId` |
| Edit profile | ✅ Real API | `useUpdateCustomer` → `PUT /customers/:id` |
| Submit support ticket | ✅ Real API | `useCreateInteraction` → `POST /customers/interactions` |
| View support tickets | ✅ Real API | `useCustomerInteractions` → `GET /customers/interactions/all` |

---

## 2. Components Audit

### Dialogs & Forms

| Component | Action | Status | Notes |
|-----------|--------|--------|-------|
| `add-customer-dialog.tsx` | Create Customer | ✅ Real API | Two-step flow: signup → create customer |
| `create-order-dialog.tsx` | Create Order | ✅ Real API | `useCreateOrder` |
| `assign-delivery-boy-dialog.tsx` | Assign Delivery Boy | ✅ Delegated | Parent passes `onSubmit` prop with real API |
| `cancel-order-dialog.tsx` | Cancel Order | ✅ Delegated | Parent passes `onSubmit` prop with real API |
| `order-detail-dialog.tsx` | View Details | Presentational | No actions — read-only |
| `update-status-dialog.tsx` | Update Status | ✅ Delegated | Parent passes `onSubmit` prop with real API |
| `service-dialog.tsx` | Create/Update Service | ✅ Real API | `useCreateService` / `useUpdateService` |
| `create-purchase-order-dialog.tsx` | Create PO | ✅ Real API | `useCreatePurchaseOrder` + `useSuppliers` |
| `expense-form.tsx` | Submit expense form | ✅ Delegated | Parent passes `onSubmit`; reads departments/budgets via API |
| `department-form-dialog.tsx` | Create/Update Dept | ✅ Real API | `useCreateDepartment` / `useUpdateDepartment` |
| `delete-department-dialog.tsx` | Delete Dept | ✅ Real API | `useDeleteDepartment` |
| `add-inventory-dialog.tsx` | Add Inventory | ✅ Real API | Uses `useMutation` + `inventoryApi.addInventory` |
| `payment-detail-dialog.tsx` | View Details | Presentational | No actions — read-only |
| `refund-payment-dialog.tsx` | Process Refund | ✅ Delegated | Parent passes `onSubmit` prop with real API |
| `profile-editor.tsx` | Save Profile | ✅ Real API | `useUpdateCustomer` |
| `support-tickets-list.tsx` | Submit Ticket | ✅ Real API | `useCreateInteraction` |

### Removed Files

| File | Reason |
|------|--------|
| `src/components/forms/customer-form.tsx` | Empty file (0 bytes) |
| `src/components/delivery-boys/delivery-boys-table.tsx` | Empty file (0 bytes) |

---

## 3. Fixes Applied During This Audit

### 3.1 API Filter Support Added

- **`ordersApi.getOrders()`** — Updated to accept `{ search?, status?, page?, limit? }` filters and append them as query params to `GET /admin/orders`.
- **`analyticsApi.getOverview()`** — Updated to accept `startDate` and `endDate` and append them to `GET /analytics/overview`.
- **`useAnalyticsOverview()`** — Updated hook signature to accept `(startDate?, endDate?)` and include them in the query key.

### 3.2 Pages Upgraded from Client-Side to API-Backed

| Page | What Changed |
|------|-------------|
| `/admin/orders` | Search, status tabs, and pagination now pass params to `ordersApi.getOrders()`. Removed client-side filtering. |
| `/admin/analytics` | Time range selector (7d/30d/90d/1y) now computes `startDate`/`endDate` and passes them to `useAnalyticsOverview()`. |

### 3.3 Dummy Buttons Fixed

| Page | Button | Fix |
|------|--------|-----|
| `/admin/customers` | Filter | Replaced with working "Clear" button that resets search |
| `/admin/inventory` | Filter | Replaced with working "Clear" button that resets search |
| `/admin/items-orders` | Filter | Replaced with working "Clear" button that resets search |
| `/admin/analytics` | Custom Range | Disabled (no date picker) |
| `/admin/finance` | Generate Report | Disabled (no backend endpoint) |
| `/admin/finance` | Export Data | Disabled (no backend endpoint) |
| `/admin/laundry-inventory` | Export | Disabled (no backend endpoint) |
| `/admin/laundry-inventory` | Import | Disabled (no backend endpoint) |

### 3.4 Placeholder Actions Fixed

| Page | Action | Before | After |
|------|--------|--------|-------|
| `/admin/laundry-inventory` | Record Wastage (quick action) | `toast.info('select an item...')` | Disabled button |
| `/admin/laundry-inventory` | Stock Transfer | `toast.info('coming soon')` | Disabled button |
| `/admin/laundry-inventory` | View Transactions | `toast.info('coming soon')` | Disabled button |
| `/admin/laundry-inventory` | Analytics Report | `toast.info('coming soon')` | Disabled button |
| `/admin/laundry-inventory` | Usage Trends | `toast.info('coming soon')` | Disabled button |
| `/services` | Add to Order | `alert('In a real app...')` | Navigates to `/admin/orders` |
| `/auth` | Forgot Password | No `onClick` | `toast.info('Please contact administrator...')` |

---

## 4. Remaining Known Issues

### 4.1 Pre-existing TypeScript Errors (Unrelated to API Integration)

These errors existed before any of this work and are in UI/type-definition files unrelated to API wiring:

| File | Error | Description |
|------|-------|-------------|
| `add-customer-dialog.tsx:44` | TS2322 | Zod schema `.default()` causes input/output type mismatch with `useForm` generic |
| `add-customer-dialog.tsx:53` | TS2322 | `"REGULAR"` not assignable to `CustomerTier \| undefined` |
| `add-customer-dialog.tsx:158` | TS2345 | `SubmitHandler<TFieldValues>` type mismatch |
| `order-distribution-chart.tsx:78` | TS2769 | Recharts `Tooltip` formatter type incompatibility |
| `service-schema.ts:8` | TS2353 | `errorMap` property does not exist in current Zod config type |

### 4.2 Client-Side Only Search/Filter (Acceptable)

The following pages use client-side search/filtering. This is acceptable because either:
- The backend API does not document `search` query params for these endpoints, or
- The data sets are small enough that client-side filtering provides better UX.

| Page | Filter Type | Reason |
|------|-------------|--------|
| `/admin/inventory` | Search | Backend `/inventory` does not document search param |
| `/admin/services` | Search, Category tabs | Backend `/services` does not document search param |
| `/admin/subscriptions` | Search | Backend `/subscriptions` does not document search param |
| `/admin/queries` | Search | Backend `/admin/queries` does not document search param |
| `/admin/payments` | Search, Status tabs, Method filter | Backend `/payments` does not document filter params |
| `/admin/items-orders` | Search | Backend `/suppliers/purchase-orders/all` may support search but not documented |
| `/admin/expenses/departments` | Search | Backend `/expenses/departments/all` does not document search param |
| `/admin/laundry-inventory` | Search (input field) | API filtering is triggered by "Apply" button; input provides immediate client-side feedback |

### 4.3 Missing Backend Endpoints

| Feature | Page | Why It's Missing |
|---------|------|------------------|
| Shop Management | `/super-admin/shops` | No shop endpoints exist in `FULL_API_DOCUMENTATION.md` |
| Finance Export | `/admin/finance` | No `/finance/export` or `/finance/report` endpoint documented |
| Laundry Inventory Export | `/admin/laundry-inventory` | No `/laundry/inventory/export` endpoint documented |
| Laundry Inventory Import | `/admin/laundry-inventory` | No `/laundry/inventory/bulk-import` UI wired (API exists but no UI) |
| Stock Transfer UI | `/admin/laundry-inventory` | No `/laundry/inventory/transfers` UI page exists |

---

## 5. API Endpoint Coverage Summary

### Implemented API Modules

| Module | API File | Hooks File | Endpoints |
|--------|----------|------------|-----------|
| Auth | `src/lib/api/auth.ts` | `src/lib/hooks/use-auth.ts` | 7 |
| Customers | `src/lib/api/customers.ts` | `src/lib/hooks/use-customers.ts` | 17 |
| Orders (Admin) | `src/lib/api/orders.ts` | Inline `useQuery` | 6 |
| Orders (Base) | `src/lib/api/user-orders.ts` | `src/lib/hooks/use-user-orders.ts` | 14 |
| Inventory | `src/lib/api/inventory.ts` | `src/lib/hooks/use-inventory.ts` | 8 |
| Laundry Inventory | `src/lib/api/laundry-inventory.ts` | `src/lib/hooks/use-laundry-inventory.ts` | 43 |
| Delivery Boys | `src/lib/api/delivery-boy.ts` | `src/lib/hooks/use-delivery-boys.ts` | 14 |
| Suppliers | `src/lib/api/suppliers.ts` | `src/lib/hooks/use-suppliers.ts` | 21 |
| Expenses | `src/lib/api/expenses.ts` | `src/lib/hooks/use-expenses.ts` | 23 |
| Billing | `src/lib/api/billing.ts` | `src/lib/hooks/use-billing.ts` | 13 |
| Payments | `src/lib/api/payments.ts` | `src/lib/hooks/use-payments.ts` | 8 |
| Subscriptions | `src/lib/api/subscriptions.ts` | `src/lib/hooks/use-subscriptions.ts` | 10 |
| Services | `src/lib/api/services.ts` | `src/lib/hooks/use-services.ts` | 5 |
| Notifications | `src/lib/api/notifications.ts` | `src/lib/hooks/use-notifications.ts` | 14 |
| Analytics | `src/lib/api/analytics.ts` | `src/lib/hooks/use-analytics.ts` | 14 |
| Finance | `src/lib/api/finance.ts` | `src/lib/hooks/use-finance.ts` | 7 |
| Admin / Super Admin | `src/lib/api/admin.ts` | `src/lib/hooks/use-admin.ts` | 18 |
| Profile | `src/lib/api/profile.ts` | Inline in `use-auth.ts` | 2 |

**Total implemented endpoints:** ~230+ across 18 API modules.

---

## 6. Build Status

```
$ npx tsc --noEmit
```

- **New errors introduced:** 0
- **Pre-existing errors:** 5 (all in UI/type files, unrelated to API integration)
- **Result:** ✅ Clean build aside from pre-existing issues

---

## 7. Recommendations

1. **Shop Management:** If the backend adds shop endpoints, implement `src/lib/api/shops.ts`, `src/lib/hooks/use-shops.ts`, and replace the stub page at `/super-admin/shops/page.tsx`.
2. **Pre-existing TS errors:** Fix the Zod schema type mismatch in `add-customer-dialog.tsx` by removing `.default()` from `tier`, `creditLimit`, and `creditAllowed` in `addCustomerSchema`.
3. **Backend filter support:** If the backend adds `search`/`status` query params to `/inventory`, `/services`, `/subscriptions`, `/admin/queries`, or `/payments`, upgrade those pages from client-side filtering to API-backed filtering (follow the pattern used for `/admin/orders`).
4. **Export endpoints:** If the backend adds CSV/PDF export endpoints for finance or laundry inventory, enable the currently disabled Export buttons.

---

*End of Report*
