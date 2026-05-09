// Finance API

import { apiClient } from './client';
import type {
  DateRange,
  FinancialMetricsResponse,
  ProfitLossResponse,
  TrendsResponse,
  ExpenseBreakdownResponse,
  CashFlowResponse,
  BudgetComparisonResponse,
  FinancialRatiosResponse,
} from '@/lib/types/finance';

// API methods
export const financeApi = {
  getMetrics: async (dateRange?: DateRange): Promise<FinancialMetricsResponse> => {
    const params = new URLSearchParams();
    if (dateRange?.from) params.append('startDate', dateRange.from.toISOString().split('T')[0]);
    if (dateRange?.to) params.append('endDate', dateRange.to.toISOString().split('T')[0]);
    const query = params.toString();
    return apiClient.get(`/finance/metrics${query ? `?${query}` : ''}`);
  },

  getProfitLoss: async (dateRange?: DateRange): Promise<ProfitLossResponse> => {
    const params = new URLSearchParams();
    if (dateRange?.from) params.append('startDate', dateRange.from.toISOString().split('T')[0]);
    if (dateRange?.to) params.append('endDate', dateRange.to.toISOString().split('T')[0]);
    const query = params.toString();
    return apiClient.get(`/finance/profit-loss${query ? `?${query}` : ''}`);
  },

  getTrends: async (dateRange?: DateRange): Promise<TrendsResponse> => {
    const params = new URLSearchParams();
    if (dateRange?.from) params.append('startDate', dateRange.from.toISOString().split('T')[0]);
    if (dateRange?.to) params.append('endDate', dateRange.to.toISOString().split('T')[0]);
    const query = params.toString();
    return apiClient.get(`/finance/trends${query ? `?${query}` : ''}`);
  },

  getExpenseBreakdown: async (dateRange?: DateRange): Promise<ExpenseBreakdownResponse> => {
    const params = new URLSearchParams();
    if (dateRange?.from) params.append('startDate', dateRange.from.toISOString().split('T')[0]);
    if (dateRange?.to) params.append('endDate', dateRange.to.toISOString().split('T')[0]);
    const query = params.toString();
    return apiClient.get(`/finance/expense-breakdown${query ? `?${query}` : ''}`);
  },

  getCashFlow: async (dateRange?: DateRange): Promise<CashFlowResponse> => {
    const params = new URLSearchParams();
    if (dateRange?.from) params.append('startDate', dateRange.from.toISOString().split('T')[0]);
    if (dateRange?.to) params.append('endDate', dateRange.to.toISOString().split('T')[0]);
    const query = params.toString();
    return apiClient.get(`/finance/cash-flow${query ? `?${query}` : ''}`);
  },

  getBudgetComparison: async (dateRange?: DateRange): Promise<BudgetComparisonResponse> => {
    const params = new URLSearchParams();
    if (dateRange?.from) params.append('startDate', dateRange.from.toISOString().split('T')[0]);
    if (dateRange?.to) params.append('endDate', dateRange.to.toISOString().split('T')[0]);
    const query = params.toString();
    return apiClient.get(`/finance/budget-comparison${query ? `?${query}` : ''}`);
  },

  getFinancialRatios: async (): Promise<FinancialRatiosResponse> => {
    return apiClient.get('/finance/ratios');
  },
};
