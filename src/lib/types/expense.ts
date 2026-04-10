// Expense Management Types

// ==================== ENUMS ====================
export enum ExpenseCategory {
  UTILITIES = 'UTILITIES',
  RENT = 'RENT',
  SALARIES = 'SALARIES',
  WAGES = 'WAGES',
  INVENTORY_PURCHASE = 'INVENTORY_PURCHASE',
  EQUIPMENT_MAINTENANCE = 'EQUIPMENT_MAINTENANCE',
  EQUIPMENT_PURCHASE = 'EQUIPMENT_PURCHASE',
  VEHICLE_MAINTENANCE = 'VEHICLE_MAINTENANCE',
  FUEL = 'FUEL',
  INSURANCE = 'INSURANCE',
  MARKETING = 'MARKETING',
  ADVERTISING = 'ADVERTISING',
  OFFICE_SUPPLIES = 'OFFICE_SUPPLIES',
  CLEANING_SUPPLIES = 'CLEANING_SUPPLIES',
  PROFESSIONAL_FEES = 'PROFESSIONAL_FEES',
  LEGAL_FEES = 'LEGAL_FEES',
  ACCOUNTING_FEES = 'ACCOUNTING_FEES',
  TRAINING = 'TRAINING',
  TRAVEL = 'TRAVEL',
  TELECOMMUNICATIONS = 'TELECOMMUNICATIONS',
  SOFTWARE_SUBSCRIPTIONS = 'SOFTWARE_SUBSCRIPTIONS',
  LICENSES_PERMITS = 'LICENSES_PERMITS',
  REPAIRS = 'REPAIRS',
  WASTE_DISPOSAL = 'WASTE_DISPOSAL',
  SECURITY = 'SECURITY',
  MISCELLANEOUS = 'MISCELLANEOUS',
}

export enum PaymentStatus {
  UNPAID = 'UNPAID',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum ApprovalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentMethod {
  CASH = 'CASH',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CHEQUE = 'CHEQUE',
  UPI = 'UPI',
  CARD = 'CARD',
  NET_BANKING = 'NET_BANKING',
}

export enum RecurrenceType {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY',
}

export enum BudgetPeriod {
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  HALF_YEARLY = 'HALF_YEARLY',
  YEARLY = 'YEARLY',
}

export enum BudgetStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  EXCEEDED = 'EXCEEDED',
  CANCELLED = 'CANCELLED',
}

// ==================== INTERFACES ====================
export interface Expense {
  id: string;
  expenseNumber: string;
  title: string;
  description?: string;
  category: ExpenseCategory;
  subCategory?: string;
  tags?: string[];
  amount: number;
  taxAmount?: number;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  approvalStatus: ApprovalStatus;
  paymentMethod?: PaymentMethod;
  paymentDate?: string;
  vendorName?: string;
  vendorContact?: string;
  invoiceNumber?: string;
  receiptUrl?: string;
  expenseDate: string;
  dueDate?: string;
  departmentId?: string;
  department?: Department;
  budgetId?: string;
  budget?: Budget;
  isRecurring: boolean;
  recurrenceType?: RecurrenceType;
  recurrenceInterval?: number;
  nextRecurrenceDate?: string;
  notes?: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  createdBy: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  id: string;
  name: string;
  description?: string | null;
  headName?: string | null;
  headEmail?: string | null;
  headPhone?: string | null;
  isActive: boolean;
  totalExpenses?: number;
  totalBudgets?: number;
  expenses?: Expense[];
  budgets?: Budget[];
  _count?: {
    expenses: number;
    budgets: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Budget {
  id: string;
  name: string;
  description?: string;
  category: ExpenseCategory;
  departmentId?: string;
  department?: Department;
  budgetPeriod: BudgetPeriod;
  startDate: string;
  endDate: string;
  allocatedAmount: number;
  spentAmount: number;
  remainingAmount: number;
  utilizationPercentage: number;
  alertThreshold: number;
  status: BudgetStatus;
  notes?: string;
  expenseCount?: number;
  createdBy: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseStatistics {
  totalExpenses: number;
  totalAmount: number;
  paidAmount: number;
  unpaidAmount: number;
  pendingApprovalCount: number;
  approvedCount: number;
  rejectedCount: number;
  overdueCount: number;
  averageExpenseAmount: number;
  monthlyTrend: number; // percentage change from last month
  categoryBreakdown: CategorySummary[];
  paymentStatusDistribution: PaymentStatusDistribution;
}

export interface CategorySummary {
  category: ExpenseCategory;
  totalAmount: number;
  expenseCount: number;
  percentage: number;
}

export interface DepartmentSummary {
  departmentId: string;
  departmentName: string;
  totalAmount: number;
  expenseCount: number;
  budgetCount: number;
  utilizationPercentage: number;
}

export interface PaymentStatusDistribution {
  paid: number;
  unpaid: number;
  partiallyPaid: number;
  overdue: number;
  pending: number;
}

export interface MonthlyTrend {
  month: string;
  year: number;
  totalExpenses: number;
  totalAmount: number;
  paidAmount: number;
  unpaidAmount: number;
}

export interface BudgetUtilization {
  budgetId: string;
  budgetName: string;
  allocatedAmount: number;
  spentAmount: number;
  remainingAmount: number;
  utilizationPercentage: number;
  isNearThreshold: boolean;
  isExceeded: boolean;
  expenseCount: number;
}

// ==================== REQUEST/RESPONSE TYPES ====================
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
  };
}

// Specific paginated response types matching actual API structure
export interface ExpensesPaginatedResponse {
  expenses: Expense[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface BudgetsPaginatedResponse {
  budgets: Budget[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface DepartmentsPaginatedResponse {
  departments: Department[];
  total: number;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateExpenseRequest {
  title: string;
  description?: string;
  category: ExpenseCategory;
  subCategory?: string;
  tags?: string[];
  amount: number;
  taxAmount?: number;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  paymentDate?: string;
  vendorName?: string;
  vendorContact?: string;
  invoiceNumber?: string;
  receiptUrl?: string;
  expenseDate: string;
  dueDate?: string;
  departmentId?: string;
  budgetId?: string;
  isRecurring?: boolean;
  recurrenceType?: RecurrenceType;
  recurrenceInterval?: number;
  notes?: string;
}

export interface UpdateExpenseRequest extends Partial<CreateExpenseRequest> {}

export interface CreateBudgetRequest {
  name: string;
  description?: string;
  category: ExpenseCategory;
  departmentId?: string;
  budgetPeriod: BudgetPeriod;
  startDate: string;
  endDate: string;
  allocatedAmount: number;
  alertThreshold?: number;
  notes?: string;
}

export interface UpdateBudgetRequest extends Partial<CreateBudgetRequest> {}

export interface CreateDepartmentRequest {
  name: string;
  description?: string;
  headName?: string;
  headEmail?: string;
  headPhone?: string;
  isActive?: boolean;
}

export interface UpdateDepartmentRequest extends Partial<CreateDepartmentRequest> {}

export interface MarkAsPaidRequest {
  paymentMethod: PaymentMethod;
  paymentDate: string;
  notes?: string;
}

export interface RejectExpenseRequest {
  rejectionReason: string;
}

// ==================== FILTER TYPES ====================
export interface ExpenseFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: ExpenseCategory;
  paymentStatus?: PaymentStatus;
  approvalStatus?: ApprovalStatus;
  departmentId?: string;
  budgetId?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  isRecurring?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface BudgetFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: ExpenseCategory;
  status?: BudgetStatus;
  budgetPeriod?: BudgetPeriod;
  departmentId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface DepartmentFilters {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface DateRangeFilter {
  startDate?: string;
  endDate?: string;
}