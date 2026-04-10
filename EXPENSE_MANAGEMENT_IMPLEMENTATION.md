# Expense Management - Frontend Implementation Guide

This document provides a complete overview of the Expense Management implementation in the LaundryPro application.

## Table of Contents
1. [Overview](#overview)
2. [File Structure](#file-structure)
3. [API Integration](#api-integration)
4. [Components](#components)
5. [Routes](#routes)
6. [Usage Examples](#usage-examples)
7. [Configuration](#configuration)

---

## Overview

The Expense Management system provides comprehensive tracking and management of business expenses, budgets, and departments. It includes:

- ✅ **Expense Tracking** - Create, edit, delete, and manage expenses
- ✅ **Approval Workflow** - Approve or reject expenses with reasons
- ✅ **Payment Management** - Track payment status and mark as paid
- ✅ **Budget Management** - Create and monitor budgets with utilization tracking
- ✅ **Department Management** - Organize expenses by departments
- ✅ **Analytics & Reporting** - Visual charts and statistics
- ✅ **Advanced Filtering** - Filter by category, status, date range, etc.

---

## File Structure

```
src/
├── app/(dashboard)/admin/expenses/
│   ├── page.tsx                    # Main dashboard with statistics
│   ├── list/page.tsx               # All expenses list with filters
│   ├── new/page.tsx                # Create new expense
│   ├── [id]/
│   │   ├── page.tsx                # View expense details
│   │   └── edit/page.tsx           # Edit expense
│   ├── budgets/page.tsx            # Budget management
│   ├── departments/page.tsx        # Department management
│   └── reports/page.tsx            # Analytics and reports
│
├── lib/
│   ├── api/
│   │   ├── client.ts               # API client with auth & token refresh
│   │   └── expenses.ts             # Expense API service functions
│   ├── hooks/
│   │   └── use-expenses.ts         # React Query hooks for expenses
│   ├── types/
│   │   └── expense.ts              # TypeScript interfaces & enums
│   └── constants/
│       └── expense.ts              # Constants, labels, and options
│
└── components/
    ├── expenses/
    │   ├── expense-filters.tsx     # Filter component
    │   ├── expense-status-badge.tsx # Status badge component
    │   ├── category-pie-chart.tsx   # Category breakdown chart
    │   ├── monthly-trends-chart.tsx # Monthly trends chart
    │   └── budget-utilization-bar.tsx # Budget progress bar
    └── layout/
        └── advanced-sidebar.tsx    # Sidebar with Expense section
```

---

## API Integration

### Base Configuration

**Environment Variable** (`.env.local`):
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
```

### API Client (`src/lib/api/client.ts`)

Features:
- Automatic JWT token management
- Token refresh on 401 errors
- Error handling
- Type-safe responses

### Expense API Service (`src/lib/api/expenses.ts`)

All API endpoints are implemented:

**Expenses:**
- `getExpenses(filters)` - GET /expenses
- `getExpenseById(id)` - GET /expenses/:id
- `createExpense(data)` - POST /expenses
- `updateExpense(id, data)` - PUT /expenses/:id
- `deleteExpense(id)` - DELETE /expenses/:id
- `approveExpense(id)` - PATCH /expenses/:id/approve
- `rejectExpense(id, data)` - PATCH /expenses/:id/reject
- `markAsPaid(id, data)` - PATCH /expenses/:id/mark-paid

**Statistics:**
- `getStatistics(dateRange)` - GET /expenses/statistics
- `getSummaryByCategory(dateRange)` - GET /expenses/summary/by-category
- `getSummaryByDepartment(dateRange)` - GET /expenses/summary/by-department
- `getMonthlyTrends(months)` - GET /expenses/trends/monthly

**Budgets:**
- `getBudgets(filters)` - GET /expenses/budgets/all
- `getBudgetById(id)` - GET /expenses/budgets/:id
- `createBudget(data)` - POST /expenses/budgets
- `updateBudget(id, data)` - PUT /expenses/budgets/:id
- `deleteBudget(id)` - DELETE /expenses/budgets/:id
- `getBudgetUtilization(id)` - GET /expenses/budgets/:id/utilization

**Departments:**
- `getDepartments(filters)` - GET /expenses/departments/all
- `getDepartmentById(id)` - GET /expenses/departments/:id
- `createDepartment(data)` - POST /expenses/departments
- `updateDepartment(id, data)` - PUT /expenses/departments/:id
- `deleteDepartment(id)` - DELETE /expenses/departments/:id

---

## React Query Hooks (`src/lib/hooks/use-expenses.ts`)

### Expense Hooks
```typescript
// Query hooks
useExpenses(filters)           // Get all expenses with filters
useExpense(id)                 // Get single expense
useExpenseStatistics(dateRange) // Get statistics
useCategorySummary(dateRange)  // Get category summary
useDepartmentSummary(dateRange) // Get department summary
useMonthlyTrends(months)       // Get monthly trends

// Mutation hooks
useCreateExpense()             // Create expense
useUpdateExpense()             // Update expense
useDeleteExpense()             // Delete expense
useApproveExpense()            // Approve expense
useRejectExpense()             // Reject expense
useMarkAsPaid()                // Mark as paid
```

### Budget Hooks
```typescript
useBudgets(filters)            // Get all budgets
useBudget(id)                  // Get single budget
useBudgetUtilization(id)       // Get budget utilization
useCreateBudget()              // Create budget
useUpdateBudget()              // Update budget
useDeleteBudget()              // Delete budget
```

### Department Hooks
```typescript
useDepartments(filters)        // Get all departments
useDepartment(id)              // Get single department
useCreateDepartment()          // Create department
useUpdateDepartment()          // Update department
useDeleteDepartment()          // Delete department
```

---

## Components

### Expense Filters (`src/components/expenses/expense-filters.tsx`)

Filter component with:
- Search by title, vendor, expense number
- Category dropdown
- Payment status dropdown
- Approval status dropdown
- Date range filters
- Clear filters button

```tsx
<ExpenseFiltersComponent 
  filters={filters} 
  onFiltersChange={setFilters} 
/>
```

### Expense Status Badge (`src/components/expenses/expense-status-badge.tsx`)

Displays payment or approval status with appropriate colors.

```tsx
<ExpenseStatusBadge 
  status={expense.paymentStatus} 
  type="payment" 
/>
<ExpenseStatusBadge 
  status={expense.approvalStatus} 
  type="approval" 
/>
```

### Category Pie Chart (`src/components/expenses/category-pie-chart.tsx`)

Visual breakdown of expenses by category using Recharts.

```tsx
<CategoryPieChart data={categories} />
```

### Monthly Trends Chart (`src/components/expenses/monthly-trends-chart.tsx`)

Line chart showing monthly expense trends.

```tsx
<MonthlyTrendsChart data={trends} />
```

### Budget Utilization Bar (`src/components/expenses/budget-utilization-bar.tsx`)

Progress bar showing budget usage with threshold indicators.

```tsx
<BudgetUtilizationBar budget={budget} />
```

---

## Routes

All routes are under `/admin/expenses`:

| Route | Description |
|-------|-------------|
| `/admin/expenses` | Dashboard with statistics and charts |
| `/admin/expenses/list` | All expenses with filtering |
| `/admin/expenses/new` | Create new expense |
| `/admin/expenses/:id` | View expense details |
| `/admin/expenses/:id/edit` | Edit expense |
| `/admin/expenses/budgets` | Budget management |
| `/admin/expenses/departments` | Department management |
| `/admin/expenses/reports` | Analytics and reports |

### Sidebar Navigation

The sidebar includes a dedicated "Expense Management" section with:
- Dashboard (shortcut: E)
- All Expenses
- Budgets
- Departments
- Reports

---

## Usage Examples

### 1. Fetch and Display Expenses

```typescript
import { useExpenses } from '@/lib/hooks/use-expenses';

function ExpenseList() {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    category: 'RENT',
    paymentStatus: 'UNPAID'
  });

  const { data, isLoading } = useExpenses(filters);
  
  const expenses = data?.data?.data || [];
  const pagination = data?.data?.pagination;

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {expenses.map(expense => (
        <div key={expense.id}>{expense.title}</div>
      ))}
    </div>
  );
}
```

### 2. Create an Expense

```typescript
import { useCreateExpense } from '@/lib/hooks/use-expenses';
import { ExpenseCategory, PaymentStatus, ApprovalStatus } from '@/lib/types/expense';

function CreateExpenseForm() {
  const createExpense = useCreateExpense();

  const handleSubmit = async (data) => {
    await createExpense.mutateAsync({
      title: 'Office Rent - January 2024',
      category: ExpenseCategory.RENT,
      amount: 50000,
      taxAmount: 9000,
      expenseDate: '2024-01-05T00:00:00.000Z',
      paymentStatus: PaymentStatus.UNPAID,
      approvalStatus: ApprovalStatus.PENDING,
      // ... other fields
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

### 3. Approve an Expense

```typescript
import { useApproveExpense } from '@/lib/hooks/use-expenses';

function ExpenseActions({ expenseId }) {
  const approveExpense = useApproveExpense();

  const handleApprove = async () => {
    if (confirm('Approve this expense?')) {
      await approveExpense.mutateAsync(expenseId);
    }
  };

  return (
    <button onClick={handleApprove}>
      Approve
    </button>
  );
}
```

### 4. Mark as Paid

```typescript
import { useMarkAsPaid } from '@/lib/hooks/use-expenses';
import { PaymentMethod } from '@/lib/types/expense';

function MarkAsPaidButton({ expenseId }) {
  const markAsPaid = useMarkAsPaid();

  const handleMarkPaid = async () => {
    await markAsPaid.mutateAsync({
      id: expenseId,
      data: {
        paymentMethod: PaymentMethod.BANK_TRANSFER,
        paymentDate: new Date().toISOString().split('T')[0],
      }
    });
  };

  return <button onClick={handleMarkPaid}>Mark as Paid</button>;
}
```

### 5. Get Statistics

```typescript
import { useExpenseStatistics } from '@/lib/hooks/use-expenses';

function ExpenseStatistics() {
  const dateRange = {
    startDate: '2024-01-01',
    endDate: '2024-01-31'
  };

  const { data, isLoading } = useExpenseStatistics(dateRange);
  const stats = data?.data;

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <p>Total Expenses: {stats.totalExpenses}</p>
      <p>Total Amount: {stats.totalAmount}</p>
      <p>Paid: {stats.paidAmount}</p>
      <p>Unpaid: {stats.unpaidAmount}</p>
    </div>
  );
}
```

### 6. Filter Expenses

```typescript
import { ExpenseFiltersComponent } from '@/components/expenses/expense-filters';
import { ExpenseCategory, PaymentStatus } from '@/lib/types/expense';

function FilteredExpenses() {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: '',
    category: undefined,
    paymentStatus: undefined,
    startDate: '',
    endDate: ''
  });

  return (
    <div>
      <ExpenseFiltersComponent 
        filters={filters} 
        onFiltersChange={setFilters} 
      />
      {/* Display filtered expenses */}
    </div>
  );
}
```

---

## Configuration

### Environment Variables

Create or update `.env.local`:

```bash
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
```

### Available Enums

```typescript
// Expense Categories
ExpenseCategory.UTILITIES
ExpenseCategory.RENT
ExpenseCategory.SALARIES
ExpenseCategory.WAGES
ExpenseCategory.INVENTORY_PURCHASE
ExpenseCategory.EQUIPMENT_MAINTENANCE
// ... and 20 more categories

// Payment Status
PaymentStatus.UNPAID
PaymentStatus.PARTIALLY_PAID
PaymentStatus.PAID
PaymentStatus.OVERDUE
PaymentStatus.PENDING
PaymentStatus.APPROVED
PaymentStatus.REJECTED

// Approval Status
ApprovalStatus.PENDING
ApprovalStatus.APPROVED
ApprovalStatus.REJECTED
ApprovalStatus.CANCELLED

// Payment Methods
PaymentMethod.CASH
PaymentMethod.BANK_TRANSFER
PaymentMethod.CHEQUE
PaymentMethod.UPI
PaymentMethod.CARD
PaymentMethod.NET_BANKING

// Budget Period
BudgetPeriod.MONTHLY
BudgetPeriod.QUARTERLY
BudgetPeriod.HALF_YEARLY
BudgetPeriod.YEARLY

// Budget Status
BudgetStatus.ACTIVE
BudgetStatus.COMPLETED
BudgetStatus.EXCEEDED
BudgetStatus.CANCELLED
```

### Constants for Dropdowns

All enums have corresponding label mappings and dropdown options:

```typescript
import { 
  EXPENSE_CATEGORY_LABELS,
  PAYMENT_STATUS_LABELS,
  CATEGORY_OPTIONS,
  PAYMENT_STATUS_OPTIONS,
  // ... etc
} from '@/lib/constants/expense';

// Usage in dropdowns
CATEGORY_OPTIONS.map(option => (
  <SelectItem key={option.value} value={option.value}>
    {option.label}
  </SelectItem>
))
```

---

## Features Overview

### ✅ Implemented Features

1. **Complete CRUD Operations**
   - Create, Read, Update, Delete for Expenses, Budgets, and Departments
   - All operations with proper error handling and success notifications

2. **Advanced Filtering**
   - Multi-criteria filtering (category, status, date range, search)
   - Pagination support
   - Sort by any field

3. **Approval Workflow**
   - Approve expenses
   - Reject with reason
   - Track approval history

4. **Payment Management**
   - Mark as paid with payment method and date
   - Track payment status
   - Overdue tracking

5. **Budget Monitoring**
   - Real-time utilization tracking
   - Alert thresholds
   - Budget vs actual visualization

6. **Analytics & Charts**
   - Category breakdown (pie chart)
   - Monthly trends (line chart)
   - Department-wise summary
   - Budget utilization bars

7. **Recurring Expenses**
   - Support for recurring expenses
   - Multiple recurrence types (daily, weekly, monthly, etc.)

8. **Department Management**
   - Department-wise expense tracking
   - Department heads
   - Budget allocation by department

---

## Error Handling

All hooks include:
- Success toasts on successful operations
- Error toasts on failures
- Automatic query invalidation and refetch
- Loading states

```typescript
const deleteExpense = useDeleteExpense();

// Usage
try {
  await deleteExpense.mutateAsync(expenseId);
  // Success toast shown automatically
} catch (error) {
  // Error toast shown automatically
}
```

---

## Type Safety

All components and hooks are fully typed with TypeScript:

```typescript
// Expense interface
interface Expense {
  id: string;
  expenseNumber: string;
  title: string;
  category: ExpenseCategory;
  amount: number;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  approvalStatus: ApprovalStatus;
  // ... and many more typed fields
}

// Filter interface
interface ExpenseFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: ExpenseCategory;
  paymentStatus?: PaymentStatus;
  approvalStatus?: ApprovalStatus;
  startDate?: string;
  endDate?: string;
  // ... etc
}
```

---

## Best Practices

1. **Use React Query Hooks** - All data fetching should use the provided hooks
2. **Type Safety** - Always import and use TypeScript types
3. **Error Handling** - Hooks handle errors automatically with toasts
4. **Filtering** - Use the ExpenseFiltersComponent for consistent UX
5. **Constants** - Use constants from `@/lib/constants/expense` for labels
6. **Enums** - Always use enums instead of string literals

---

## Testing the Implementation

### 1. Start the Backend API
```bash
# Make sure your backend is running on http://localhost:5000
```

### 2. Start the Frontend
```bash
npm run dev
```

### 3. Navigate to Expenses
```
http://localhost:3000/admin/expenses
```

### 4. Test Features
- View dashboard with statistics
- Create a new expense
- Filter expenses
- Approve/reject expenses
- Mark as paid
- Create budgets
- Create departments

---

## Troubleshooting

### API Connection Issues
- Check `.env.local` has correct API URL
- Verify backend is running
- Check browser console for CORS errors

### Authentication Issues
- Ensure you're logged in as ADMIN or SUPER_ADMIN
- Check token in localStorage (`auth-storage`)
- Token auto-refreshes on 401 errors

### Select Component Errors
- Never use empty string (`""`) for SelectItem values
- Use `"all"` for "All categories/statuses" options
- Filter component handles this correctly

---

## Future Enhancements

Possible future features:
- [ ] Bulk operations (approve/delete multiple)
- [ ] Export to CSV/Excel
- [ ] Advanced analytics dashboard
- [ ] Expense templates
- [ ] Attachments upload
- [ ] Email notifications
- [ ] Multi-currency support
- [ ] Tax calculation automation

---

## Support

For issues or questions:
1. Check this documentation
2. Review API documentation
3. Check TypeScript types in `src/lib/types/expense.ts`
4. Review constants in `src/lib/constants/expense.ts`

---

**Last Updated:** 2024-01-17  
**Version:** 1.0  
**Implementation Status:** ✅ Complete
