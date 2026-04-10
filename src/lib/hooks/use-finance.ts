// Finance Management Hooks

import { useQuery } from '@tanstack/react-query';
import { financeApi } from '@/lib/api/finance';
import type { DateRange, TimePeriod, CashFlowPeriod } from '@/lib/types/finance';

// Get overall financial metrics
export const useFinancialMetrics = (dateRange?: DateRange) => {
  return useQuery({
    queryKey: ['financial-metrics', dateRange],
    queryFn: () => financeApi.getMetrics(dateRange),
    staleTime: 60000, // 1 minute
  });
};

// Get profit & loss data
export const useProfitLoss = (dateRange?: DateRange) => {
  return useQuery({
    queryKey: ['profit-loss', dateRange],
    queryFn: () => financeApi.getProfitLoss(dateRange),
    staleTime: 60000,
  });
};

// Get revenue vs expense trends
export const useRevenueExpenseTrends = (period: TimePeriod = 'monthly') => {
  return useQuery({
    queryKey: ['revenue-expense-trends', period],
    queryFn: () => financeApi.getTrends(period),
    staleTime: 60000,
  });
};

// Get expense breakdown by category
export const useExpenseBreakdown = (dateRange?: DateRange) => {
  return useQuery({
    queryKey: ['expense-breakdown', dateRange],
    queryFn: () => financeApi.getExpenseBreakdown(dateRange),
    staleTime: 60000,
  });
};

// Get cash flow data
export const useCashFlow = (period: CashFlowPeriod = 'monthly') => {
  return useQuery({
    queryKey: ['cash-flow', period],
    queryFn: () => financeApi.getCashFlow(period),
    staleTime: 60000,
  });
};

// Get budget vs actual comparison
export const useBudgetComparison = (dateRange?: DateRange) => {
  return useQuery({
    queryKey: ['budget-comparison', dateRange],
    queryFn: () => financeApi.getBudgetComparison(dateRange),
    staleTime: 60000,
  });
};

// Get financial ratios
export const useFinancialRatios = () => {
  return useQuery({
    queryKey: ['financial-ratios'],
    queryFn: () => financeApi.getFinancialRatios(),
    staleTime: 300000, // 5 minutes
  });
};
