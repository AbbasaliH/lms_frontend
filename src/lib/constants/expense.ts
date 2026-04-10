// Expense Management Constants

import {
  ExpenseCategory,
  PaymentStatus,
  ApprovalStatus,
  PaymentMethod,
  RecurrenceType,
  BudgetPeriod,
  BudgetStatus,
} from '@/lib/types/expense';

// Category Labels
export const EXPENSE_CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  [ExpenseCategory.UTILITIES]: 'Utilities',
  [ExpenseCategory.RENT]: 'Rent',
  [ExpenseCategory.SALARIES]: 'Salaries',
  [ExpenseCategory.WAGES]: 'Wages',
  [ExpenseCategory.INVENTORY_PURCHASE]: 'Inventory Purchase',
  [ExpenseCategory.EQUIPMENT_MAINTENANCE]: 'Equipment Maintenance',
  [ExpenseCategory.EQUIPMENT_PURCHASE]: 'Equipment Purchase',
  [ExpenseCategory.VEHICLE_MAINTENANCE]: 'Vehicle Maintenance',
  [ExpenseCategory.FUEL]: 'Fuel',
  [ExpenseCategory.INSURANCE]: 'Insurance',
  [ExpenseCategory.MARKETING]: 'Marketing',
  [ExpenseCategory.ADVERTISING]: 'Advertising',
  [ExpenseCategory.OFFICE_SUPPLIES]: 'Office Supplies',
  [ExpenseCategory.CLEANING_SUPPLIES]: 'Cleaning Supplies',
  [ExpenseCategory.PROFESSIONAL_FEES]: 'Professional Fees',
  [ExpenseCategory.LEGAL_FEES]: 'Legal Fees',
  [ExpenseCategory.ACCOUNTING_FEES]: 'Accounting Fees',
  [ExpenseCategory.TRAINING]: 'Training',
  [ExpenseCategory.TRAVEL]: 'Travel',
  [ExpenseCategory.TELECOMMUNICATIONS]: 'Telecommunications',
  [ExpenseCategory.SOFTWARE_SUBSCRIPTIONS]: 'Software Subscriptions',
  [ExpenseCategory.LICENSES_PERMITS]: 'Licenses & Permits',
  [ExpenseCategory.REPAIRS]: 'Repairs',
  [ExpenseCategory.WASTE_DISPOSAL]: 'Waste Disposal',
  [ExpenseCategory.SECURITY]: 'Security',
  [ExpenseCategory.MISCELLANEOUS]: 'Miscellaneous',
};

// Payment Status Labels
export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  [PaymentStatus.UNPAID]: 'Unpaid',
  [PaymentStatus.PARTIALLY_PAID]: 'Partially Paid',
  [PaymentStatus.PAID]: 'Paid',
  [PaymentStatus.OVERDUE]: 'Overdue',
  [PaymentStatus.PENDING]: 'Pending',
  [PaymentStatus.APPROVED]: 'Approved',
  [PaymentStatus.REJECTED]: 'Rejected',
};

// Approval Status Labels
export const APPROVAL_STATUS_LABELS: Record<ApprovalStatus, string> = {
  [ApprovalStatus.PENDING]: 'Pending',
  [ApprovalStatus.APPROVED]: 'Approved',
  [ApprovalStatus.REJECTED]: 'Rejected',
  [ApprovalStatus.CANCELLED]: 'Cancelled',
};

// Payment Method Labels
export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  [PaymentMethod.CASH]: 'Cash',
  [PaymentMethod.BANK_TRANSFER]: 'Bank Transfer',
  [PaymentMethod.CHEQUE]: 'Cheque',
  [PaymentMethod.UPI]: 'UPI',
  [PaymentMethod.CARD]: 'Card',
  [PaymentMethod.NET_BANKING]: 'Net Banking',
};

// Recurrence Type Labels
export const RECURRENCE_TYPE_LABELS: Record<RecurrenceType, string> = {
  [RecurrenceType.DAILY]: 'Daily',
  [RecurrenceType.WEEKLY]: 'Weekly',
  [RecurrenceType.MONTHLY]: 'Monthly',
  [RecurrenceType.QUARTERLY]: 'Quarterly',
  [RecurrenceType.YEARLY]: 'Yearly',
};

// Budget Period Labels
export const BUDGET_PERIOD_LABELS: Record<BudgetPeriod, string> = {
  [BudgetPeriod.MONTHLY]: 'Monthly',
  [BudgetPeriod.QUARTERLY]: 'Quarterly',
  [BudgetPeriod.HALF_YEARLY]: 'Half-Yearly',
  [BudgetPeriod.YEARLY]: 'Yearly',
};

// Budget Status Labels
export const BUDGET_STATUS_LABELS: Record<BudgetStatus, string> = {
  [BudgetStatus.ACTIVE]: 'Active',
  [BudgetStatus.COMPLETED]: 'Completed',
  [BudgetStatus.EXCEEDED]: 'Exceeded',
  [BudgetStatus.CANCELLED]: 'Cancelled',
};

// Status Variant Mapping for Badge component
export const PAYMENT_STATUS_VARIANTS: Record<PaymentStatus, 'default' | 'destructive' | 'outline' | 'secondary'> = {
  [PaymentStatus.UNPAID]: 'destructive',
  [PaymentStatus.PARTIALLY_PAID]: 'outline',
  [PaymentStatus.PAID]: 'default',
  [PaymentStatus.OVERDUE]: 'destructive',
  [PaymentStatus.PENDING]: 'outline',
  [PaymentStatus.APPROVED]: 'default',
  [PaymentStatus.REJECTED]: 'destructive',
};

export const APPROVAL_STATUS_VARIANTS: Record<ApprovalStatus, 'default' | 'destructive' | 'outline' | 'secondary'> = {
  [ApprovalStatus.PENDING]: 'outline',
  [ApprovalStatus.APPROVED]: 'default',
  [ApprovalStatus.REJECTED]: 'destructive',
  [ApprovalStatus.CANCELLED]: 'secondary',
};

export const BUDGET_STATUS_VARIANTS: Record<BudgetStatus, 'default' | 'destructive' | 'outline' | 'secondary'> = {
  [BudgetStatus.ACTIVE]: 'default',
  [BudgetStatus.COMPLETED]: 'secondary',
  [BudgetStatus.EXCEEDED]: 'destructive',
  [BudgetStatus.CANCELLED]: 'outline',
};

// Category Options for Dropdowns
export const CATEGORY_OPTIONS = Object.entries(EXPENSE_CATEGORY_LABELS).map(([value, label]) => ({
  value,
  label,
}));

export const PAYMENT_STATUS_OPTIONS = Object.entries(PAYMENT_STATUS_LABELS).map(([value, label]) => ({
  value,
  label,
}));

export const APPROVAL_STATUS_OPTIONS = Object.entries(APPROVAL_STATUS_LABELS).map(([value, label]) => ({
  value,
  label,
}));

export const PAYMENT_METHOD_OPTIONS = Object.entries(PAYMENT_METHOD_LABELS).map(([value, label]) => ({
  value,
  label,
}));

export const RECURRENCE_TYPE_OPTIONS = Object.entries(RECURRENCE_TYPE_LABELS).map(([value, label]) => ({
  value,
  label,
}));

export const BUDGET_PERIOD_OPTIONS = Object.entries(BUDGET_PERIOD_LABELS).map(([value, label]) => ({
  value,
  label,
}));

export const BUDGET_STATUS_OPTIONS = Object.entries(BUDGET_STATUS_LABELS).map(([value, label]) => ({
  value,
  label,
}));