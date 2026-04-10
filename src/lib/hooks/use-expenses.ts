// Expense Management Hooks

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { expensesApi } from '@/lib/api/expenses';
import type {
  ExpenseFilters,
  BudgetFilters,
  DepartmentFilters,
  DateRangeFilter,
  CreateExpenseRequest,
  UpdateExpenseRequest,
  CreateBudgetRequest,
  UpdateBudgetRequest,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
  MarkAsPaidRequest,
  RejectExpenseRequest,
} from '@/lib/types/expense';

// ==================== EXPENSES ====================
export const useExpenses = (filters: ExpenseFilters = {}) => {
  return useQuery({
    queryKey: ['expenses', filters],
    queryFn: () => expensesApi.getExpenses(filters),
  });
};

export const useExpense = (id: string) => {
  return useQuery({
    queryKey: ['expense', id],
    queryFn: () => expensesApi.getExpenseById(id),
    enabled: !!id,
  });
};

export const useCreateExpense = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateExpenseRequest) => expensesApi.createExpense(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['expense-statistics'] });
      toast.success('Expense created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create expense');
    },
  });
};

export const useUpdateExpense = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateExpenseRequest }) => 
      expensesApi.updateExpense(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['expense', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['expense-statistics'] });
      toast.success('Expense updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update expense');
    },
  });
};

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => expensesApi.deleteExpense(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['expense-statistics'] });
      toast.success('Expense deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete expense');
    },
  });
};

export const useApproveExpense = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => expensesApi.approveExpense(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['expense', id] });
      queryClient.invalidateQueries({ queryKey: ['expense-statistics'] });
      toast.success('Expense approved successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to approve expense');
    },
  });
};

export const useRejectExpense = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: RejectExpenseRequest }) => 
      expensesApi.rejectExpense(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['expense', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['expense-statistics'] });
      toast.success('Expense rejected');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to reject expense');
    },
  });
};

export const useMarkAsPaid = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: MarkAsPaidRequest }) => 
      expensesApi.markAsPaid(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['expense', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['expense-statistics'] });
      toast.success('Expense marked as paid');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to mark as paid');
    },
  });
};

// ==================== STATISTICS ====================
export const useExpenseStatistics = (dateRange?: DateRangeFilter) => {
  return useQuery({
    queryKey: ['expense-statistics', dateRange],
    queryFn: () => expensesApi.getStatistics(dateRange),
  });
};

export const useCategorySummary = (dateRange?: DateRangeFilter) => {
  return useQuery({
    queryKey: ['category-summary', dateRange],
    queryFn: () => expensesApi.getSummaryByCategory(dateRange),
  });
};

export const useDepartmentSummary = (dateRange?: DateRangeFilter) => {
  return useQuery({
    queryKey: ['department-summary', dateRange],
    queryFn: () => expensesApi.getSummaryByDepartment(dateRange),
  });
};

export const useMonthlyTrends = (months: number = 12) => {
  return useQuery({
    queryKey: ['monthly-trends', months],
    queryFn: () => expensesApi.getMonthlyTrends(months),
  });
};

// ==================== BUDGETS ====================
export const useBudgets = (filters: BudgetFilters = {}) => {
  return useQuery({
    queryKey: ['budgets', filters],
    queryFn: () => expensesApi.getBudgets(filters),
  });
};

export const useBudget = (id: string) => {
  return useQuery({
    queryKey: ['budget', id],
    queryFn: () => expensesApi.getBudgetById(id),
    enabled: !!id,
  });
};

export const useBudgetUtilization = (id: string) => {
  return useQuery({
    queryKey: ['budget-utilization', id],
    queryFn: () => expensesApi.getBudgetUtilization(id),
    enabled: !!id,
  });
};

export const useCreateBudget = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateBudgetRequest) => expensesApi.createBudget(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      toast.success('Budget created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create budget');
    },
  });
};

export const useUpdateBudget = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBudgetRequest }) => 
      expensesApi.updateBudget(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['budget', variables.id] });
      toast.success('Budget updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update budget');
    },
  });
};

export const useDeleteBudget = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => expensesApi.deleteBudget(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      toast.success('Budget deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete budget');
    },
  });
};

// ==================== DEPARTMENTS ====================
export const useDepartments = (filters: DepartmentFilters = {}) => {
  return useQuery({
    queryKey: ['departments', filters],
    queryFn: () => expensesApi.getDepartments(filters),
  });
};

export const useDepartment = (id: string) => {
  return useQuery({
    queryKey: ['department', id],
    queryFn: () => expensesApi.getDepartmentById(id),
    enabled: !!id,
  });
};

export const useCreateDepartment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateDepartmentRequest) => expensesApi.createDepartment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      toast.success('Department created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create department');
    },
  });
};

export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDepartmentRequest }) => 
      expensesApi.updateDepartment(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      queryClient.invalidateQueries({ queryKey: ['department', variables.id] });
      toast.success('Department updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update department');
    },
  });
};

export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => expensesApi.deleteDepartment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      toast.success('Department deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete department');
    },
  });
};