// Expense Management API Services

import { apiClient } from './client';
import type {
  Expense,
  Department,
  Budget,
  ExpenseStatistics,
  CategorySummary,
  DepartmentSummary,
  MonthlyTrend,
  BudgetUtilization,
  ApiResponse,
  ExpensesPaginatedResponse,
  BudgetsPaginatedResponse,
  DepartmentsPaginatedResponse,
  CreateExpenseRequest,
  UpdateExpenseRequest,
  CreateBudgetRequest,
  UpdateBudgetRequest,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
  MarkAsPaidRequest,
  RejectExpenseRequest,
  ExpenseFilters,
  BudgetFilters,
  DepartmentFilters,
  DateRangeFilter,
} from '@/lib/types/expense';

const BASE_URL = '/expenses';

export const expensesApi = {
  // ==================== EXPENSES ====================
  getExpenses: async (filters: ExpenseFilters = {}): Promise<ApiResponse<ExpensesPaginatedResponse>> => {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    const queryString = queryParams.toString();
    return apiClient.get(`${BASE_URL}${queryString ? `?${queryString}` : ''}`);
  },

  getExpenseById: async (id: string): Promise<ApiResponse<Expense>> => {
    return apiClient.get(`${BASE_URL}/${id}`);
  },

  createExpense: async (data: CreateExpenseRequest): Promise<ApiResponse<Expense>> => {
    return apiClient.post(BASE_URL, data);
  },

  updateExpense: async (id: string, data: UpdateExpenseRequest): Promise<ApiResponse<Expense>> => {
    return apiClient.put(`${BASE_URL}/${id}`, data);
  },

  deleteExpense: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete(`${BASE_URL}/${id}`);
  },

  approveExpense: async (id: string): Promise<ApiResponse<Expense>> => {
    return apiClient.patch(`${BASE_URL}/${id}/approve`);
  },

  rejectExpense: async (id: string, data: RejectExpenseRequest): Promise<ApiResponse<Expense>> => {
    return apiClient.patch(`${BASE_URL}/${id}/reject`, data);
  },

  markAsPaid: async (id: string, data: MarkAsPaidRequest): Promise<ApiResponse<Expense>> => {
    return apiClient.patch(`${BASE_URL}/${id}/mark-paid`, data);
  },

  // ==================== STATISTICS & ANALYTICS ====================
  getStatistics: async (dateRange?: DateRangeFilter): Promise<ApiResponse<ExpenseStatistics>> => {
    const queryParams = new URLSearchParams();
    if (dateRange?.startDate) queryParams.append('startDate', dateRange.startDate);
    if (dateRange?.endDate) queryParams.append('endDate', dateRange.endDate);
    const queryString = queryParams.toString();
    return apiClient.get(`${BASE_URL}/statistics${queryString ? `?${queryString}` : ''}`);
  },

  getSummaryByCategory: async (dateRange?: DateRangeFilter): Promise<ApiResponse<CategorySummary[]>> => {
    const queryParams = new URLSearchParams();
    if (dateRange?.startDate) queryParams.append('startDate', dateRange.startDate);
    if (dateRange?.endDate) queryParams.append('endDate', dateRange.endDate);
    const queryString = queryParams.toString();
    return apiClient.get(`${BASE_URL}/summary/by-category${queryString ? `?${queryString}` : ''}`);
  },

  getSummaryByDepartment: async (dateRange?: DateRangeFilter): Promise<ApiResponse<DepartmentSummary[]>> => {
    const queryParams = new URLSearchParams();
    if (dateRange?.startDate) queryParams.append('startDate', dateRange.startDate);
    if (dateRange?.endDate) queryParams.append('endDate', dateRange.endDate);
    const queryString = queryParams.toString();
    return apiClient.get(`${BASE_URL}/summary/by-department${queryString ? `?${queryString}` : ''}`);
  },

  getMonthlyTrends: async (months: number = 12): Promise<ApiResponse<MonthlyTrend[]>> => {
    return apiClient.get(`${BASE_URL}/trends/monthly?months=${months}`);
  },

  // ==================== BUDGETS ====================
  getBudgets: async (filters: BudgetFilters = {}): Promise<ApiResponse<BudgetsPaginatedResponse>> => {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    const queryString = queryParams.toString();
    return apiClient.get(`${BASE_URL}/budgets/all${queryString ? `?${queryString}` : ''}`);
  },

  getBudgetById: async (id: string): Promise<ApiResponse<Budget>> => {
    return apiClient.get(`${BASE_URL}/budgets/${id}`);
  },

  createBudget: async (data: CreateBudgetRequest): Promise<ApiResponse<Budget>> => {
    return apiClient.post(`${BASE_URL}/budgets`, data);
  },

  updateBudget: async (id: string, data: UpdateBudgetRequest): Promise<ApiResponse<Budget>> => {
    return apiClient.put(`${BASE_URL}/budgets/${id}`, data);
  },

  deleteBudget: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete(`${BASE_URL}/budgets/${id}`);
  },

  getBudgetUtilization: async (id: string): Promise<ApiResponse<BudgetUtilization>> => {
    return apiClient.get(`${BASE_URL}/budgets/${id}/utilization`);
  },

  // ==================== DEPARTMENTS ====================
  getDepartments: async (filters: DepartmentFilters = {}): Promise<ApiResponse<DepartmentsPaginatedResponse>> => {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    const queryString = queryParams.toString();
    return apiClient.get(`${BASE_URL}/departments/all${queryString ? `?${queryString}` : ''}`);
  },

  getDepartmentById: async (id: string): Promise<ApiResponse<Department>> => {
    return apiClient.get(`${BASE_URL}/departments/${id}`);
  },

  createDepartment: async (data: CreateDepartmentRequest): Promise<ApiResponse<Department>> => {
    return apiClient.post(`${BASE_URL}/departments`, data);
  },

  updateDepartment: async (id: string, data: UpdateDepartmentRequest): Promise<ApiResponse<Department>> => {
    return apiClient.put(`${BASE_URL}/departments/${id}`, data);
  },

  deleteDepartment: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete(`${BASE_URL}/departments/${id}`);
  },
};