// Finance Management Types

export interface FinancialMetrics {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
  cashFlow: number;
  outstandingReceivables: number;
  revenueChange: number;
  expenseChange: number;
  profitChange: number;
  cashFlowChange: number;
  receivablesChange: number;
}

export interface RevenueBreakdown {
  laundryServices: number;
  dryCleaningServices: number;
  ironingServices: number;
  additionalServices: number;
  total: number;
}

export interface ExpenseBreakdown {
  materials: number;
  detergents: number;
  labor: number;
  utilities: number;
  waterBill: number;
  electricity: number;
  marketing: number;
  rent: number;
  maintenance: number;
  equipment: number;
  transportation: number;
  other: number;
  total: number;
}

export interface ProfitLossData {
  revenue: RevenueBreakdown;
  expenses: ExpenseBreakdown;
  grossProfit: number;
  operatingIncome: number;
  netProfit: number;
  profitMargin: number;
}

export interface TimeSeriesData {
  date: string;
  revenue: number;
  expenses: number;
  profit: number;
  profitMargin: number;
}

export interface ExpenseCategory {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface CashFlowData {
  period: string;
  inflow: number;
  outflow: number;
  netCashFlow: number;
}

export interface BudgetComparison {
  department: string;
  budgeted: number;
  actual: number;
  variance: number;
  variancePercent: number;
  status: 'under' | 'on-track' | 'over';
}

export interface FinancialRatio {
  name: string;
  value: number;
  unit: string;
  description: string;
  status: 'healthy' | 'warning' | 'critical';
  target?: number;
}

export interface DateRange {
  from: Date;
  to: Date;
}

export type TimePeriod = 'weekly' | 'monthly' | 'quarterly' | 'yearly';
export type CashFlowPeriod = 'monthly' | 'quarterly';

// API Response Types
export interface FinancialMetricsResponse {
  success: boolean;
  data: FinancialMetrics;
  message?: string;
}

export interface ProfitLossResponse {
  success: boolean;
  data: ProfitLossData;
  message?: string;
}

export interface TimeSeriesResponse {
  success: boolean;
  data: TimeSeriesData[];
  message?: string;
}

export interface ExpenseBreakdownResponse {
  success: boolean;
  data: ExpenseCategory[];
  message?: string;
}

export interface CashFlowResponse {
  success: boolean;
  data: CashFlowData[];
  message?: string;
}

export interface BudgetComparisonResponse {
  success: boolean;
  data: BudgetComparison[];
  message?: string;
}

export interface FinancialRatiosResponse {
  success: boolean;
  data: FinancialRatio[];
  message?: string;
}
