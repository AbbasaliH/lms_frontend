// Finance Management Types

// ==================== CORE DATA TYPES ====================

export interface FinancialMetrics {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
  totalOrders: number;
  totalInvoices: number;
  outstandingReceivables: number;
  pendingExpenses: number;
  // Optional frontend-computed fields
  revenueChange?: number;
  expenseChange?: number;
  profitChange?: number;
  cashFlow?: number;
  cashFlowChange?: number;
  receivablesChange?: number;
}

export interface TrendItem {
  date: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export interface TrendsData {
  trends: TrendItem[];
  from: string;
  to: string;
}

export interface ExpenseBreakdownItem {
  category: string;
  totalAmount: number;
  count: number;
}

export interface CashFlowData {
  totalInflow: number;
  totalOutflow: number;
  netCashFlow: number;
}

export interface BudgetComparisonItem {
  id: string;
  name: string;
  category: string;
  allocatedAmount: number;
  spentAmount: number;
  remainingAmount: number;
  alertThreshold: number;
  status: string;
  expenseCount: number;
  utilizationPercent: number;
}

export interface ProfitLossData {
  revenue: number;
  expenses: number;
  grossProfit: number;
  netProfit: number;
  grossProfitMargin: number;
  netProfitMargin: number;
}

export interface FinancialRatiosData {
  profitMargin: number;
  expenseToRevenueRatio: number;
  budgetUtilization: number;
  averageOrderValue: number;
  outstandingToRevenueRatio: number;
  // Optional extended fields
  currentRatio?: number;
  debtToEquity?: number;
  returnOnEquity?: number;
  inventoryTurnover?: number;
  daysReceivable?: number;
  operatingMargin?: number;
}

// ==================== REQUEST TYPES ====================

export interface DateRange {
  from: Date;
  to: Date;
}

export type TimePeriod = 'weekly' | 'monthly' | 'quarterly' | 'yearly';
export type CashFlowPeriod = 'monthly' | 'quarterly';

// ==================== API RESPONSE TYPES ====================

export interface FinancialMetricsResponse {
  success: boolean;
  data: FinancialMetrics;
  message?: string;
}

export interface TrendsResponse {
  success: boolean;
  data: TrendsData;
  message?: string;
}

export interface ExpenseBreakdownResponse {
  success: boolean;
  data: ExpenseBreakdownItem[];
  message?: string;
}

export interface CashFlowResponse {
  success: boolean;
  data: CashFlowData;
  message?: string;
}

export interface BudgetComparisonResponse {
  success: boolean;
  data: BudgetComparisonItem[];
  message?: string;
}

export interface ProfitLossResponse {
  success: boolean;
  data: ProfitLossData;
  message?: string;
}

export interface FinancialRatiosResponse {
  success: boolean;
  data: FinancialRatiosData;
  message?: string;
}
