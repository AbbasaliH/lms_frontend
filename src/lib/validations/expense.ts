// Expense Form Validation Schemas

import { z } from 'zod';
import {
  ExpenseCategory,
  PaymentStatus,
  PaymentMethod,
  RecurrenceType,
  BudgetPeriod,
} from '@/lib/types/expense';

// Expense Form Schema
export const expenseFormSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must not exceed 200 characters'),
  
  description: z.string()
    .max(1000, 'Description must not exceed 1000 characters')
    .optional(),
  
  category: z.nativeEnum(ExpenseCategory, {
    message: 'Category is required',
  }),
  
  subCategory: z.string()
    .max(100, 'Sub-category must not exceed 100 characters')
    .optional(),
  
  tags: z.array(z.string())
    .max(10, 'Maximum 10 tags allowed')
    .optional(),
  
  amount: z.number({
    message: 'Amount is required',
  })
    .min(0, 'Amount must be positive')
    .multipleOf(0.01, 'Amount must have at most 2 decimal places'),
  
  taxAmount: z.number()
    .min(0, 'Tax amount must be positive')
    .multipleOf(0.01, 'Tax amount must have at most 2 decimal places')
    .optional()
    .nullable(),
  
  expenseDate: z.string({
    message: 'Expense date is required',
  }),
  
  dueDate: z.string().optional().nullable(),
  
  paymentStatus: z.nativeEnum(PaymentStatus, {
    message: 'Payment status is required',
  }),
  
  paymentMethod: z.nativeEnum(PaymentMethod).optional().nullable(),
  
  paymentDate: z.string().optional().nullable(),
  
  vendorName: z.string()
    .max(200, 'Vendor name must not exceed 200 characters')
    .optional(),
  
  vendorContact: z.string()
    .regex(/^[+]?[\d\s-()]+$/, 'Invalid phone number format')
    .optional(),
  
  invoiceNumber: z.string()
    .max(100, 'Invoice number must not exceed 100 characters')
    .optional(),
  
  receiptUrl: z.string().url('Invalid URL').optional(),
  
  departmentId: z.string().optional(),
  
  budgetId: z.string().optional(),
  
  isRecurring: z.boolean(),
  
  recurrenceType: z.nativeEnum(RecurrenceType).optional().nullable(),
  
  recurrenceInterval: z.number()
    .min(1, 'Recurrence interval must be at least 1')
    .optional()
    .nullable(),
  
  notes: z.string()
    .max(500, 'Notes must not exceed 500 characters')
    .optional(),
})
.refine((data) => {
  if (data.paymentStatus === PaymentStatus.PAID) {
    return !!data.paymentMethod;
  }
  return true;
}, {
  message: 'Payment method is required when status is paid',
  path: ['paymentMethod'],
})
.refine((data) => {
  if (data.paymentStatus === PaymentStatus.PAID) {
    return !!data.paymentDate;
  }
  return true;
}, {
  message: 'Payment date is required when status is paid',
  path: ['paymentDate'],
})
.refine((data) => {
  if (data.isRecurring) {
    return !!data.recurrenceType;
  }
  return true;
}, {
  message: 'Recurrence type is required for recurring expenses',
  path: ['recurrenceType'],
})
.refine((data) => {
  if (data.isRecurring) {
    return !!data.recurrenceInterval && data.recurrenceInterval > 0;
  }
  return true;
}, {
  message: 'Recurrence interval is required for recurring expenses',
  path: ['recurrenceInterval'],
})
.refine((data) => {
  if (data.dueDate && data.expenseDate) {
    return new Date(data.dueDate) >= new Date(data.expenseDate);
  }
  return true;
}, {
  message: 'Due date must be after expense date',
  path: ['dueDate'],
});

export type ExpenseFormValues = z.infer<typeof expenseFormSchema>;

// Budget Form Schema
export const budgetFormSchema = z.object({
  name: z.string()
    .min(3, 'Budget name must be at least 3 characters')
    .max(200, 'Budget name must not exceed 200 characters'),
  
  description: z.string()
    .max(500, 'Description must not exceed 500 characters')
    .optional(),
  
  category: z.nativeEnum(ExpenseCategory, {
    message: 'Category is required',
  }),
  
  budgetPeriod: z.nativeEnum(BudgetPeriod, {
    message: 'Budget period is required',
  }),
  
  startDate: z.string({
    message: 'Start date is required',
  }),
  
  endDate: z.string({
    message: 'End date is required',
  }),
  
  allocatedAmount: z.number({
    message: 'Allocated amount is required',
  })
    .min(1, 'Allocated amount must be greater than 0'),
  
  alertThreshold: z.number()
    .min(0, 'Alert threshold must be between 0 and 100')
    .max(100, 'Alert threshold must be between 0 and 100')
    .default(80),
  
  departmentId: z.string().optional(),
  
  notes: z.string()
    .max(500, 'Notes must not exceed 500 characters')
    .optional(),
})
.refine((data) => {
  return new Date(data.endDate) > new Date(data.startDate);
}, {
  message: 'End date must be after start date',
  path: ['endDate'],
});

export type BudgetFormValues = z.infer<typeof budgetFormSchema>;

// Department Form Schema
export const departmentFormSchema = z.object({
  name: z.string()
    .min(2, 'Department name must be at least 2 characters')
    .max(100, 'Department name must not exceed 100 characters'),
  
  description: z.string()
    .max(500, 'Description must not exceed 500 characters')
    .optional(),
  
  headName: z.string()
    .max(100, 'Head name must not exceed 100 characters')
    .optional(),
  
  headEmail: z.string()
    .email('Invalid email format')
    .max(100, 'Email must not exceed 100 characters')
    .optional(),
  
  headPhone: z.string()
    .regex(/^[+]?[\d\s-()]+$/, 'Invalid phone number format')
    .optional(),
  
  isActive: z.boolean().default(true),
});

export type DepartmentFormValues = z.infer<typeof departmentFormSchema>;

// Mark as Paid Schema
export const markAsPaidSchema = z.object({
  paymentMethod: z.nativeEnum(PaymentMethod, {
    message: 'Payment method is required',
  }),
  
  paymentDate: z.string({
    message: 'Payment date is required',
  }),
  
  notes: z.string()
    .max(500, 'Notes must not exceed 500 characters')
    .optional(),
});

export type MarkAsPaidFormValues = z.infer<typeof markAsPaidSchema>;

// Reject Expense Schema
export const rejectExpenseSchema = z.object({
  rejectionReason: z.string()
    .min(10, 'Rejection reason must be at least 10 characters')
    .max(500, 'Rejection reason must not exceed 500 characters'),
});

export type RejectExpenseFormValues = z.infer<typeof rejectExpenseSchema>;