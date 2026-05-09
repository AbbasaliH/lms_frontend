// Admin & Super Admin Hooks

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { adminApi } from '@/lib/api/admin';

// Query Keys
export const adminKeys = {
  all: ['admin'] as const,
  dashboard: () => [...adminKeys.all, 'dashboard'] as const,
  pendingUsers: () => [...adminKeys.all, 'pending-users'] as const,
  queries: () => [...adminKeys.all, 'queries'] as const,
  admins: () => [...adminKeys.all, 'admins'] as const,
  admin: (id: string) => [...adminKeys.all, 'admin', id] as const,
  subscriptions: () => [...adminKeys.all, 'subscriptions'] as const,
  overview: () => [...adminKeys.all, 'overview'] as const,
  analytics: () => [...adminKeys.all, 'analytics'] as const,
  activities: () => [...adminKeys.all, 'activities'] as const,
  settings: () => [...adminKeys.all, 'settings'] as const,
  reporting: () => [...adminKeys.all, 'reporting'] as const,
};

// ==================== ADMIN DASHBOARD ====================
export const useAdminDashboard = () => {
  return useQuery({
    queryKey: adminKeys.dashboard(),
    queryFn: () => adminApi.getAdminDashboard(),
  });
};

// ==================== PENDING USERS ====================
export const usePendingUsers = () => {
  return useQuery({
    queryKey: adminKeys.pendingUsers(),
    queryFn: () => adminApi.getPendingUsers(),
  });
};

export const useApproveUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => adminApi.approveUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.pendingUsers() });
      toast.success('User approved successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to approve user');
    },
  });
};

// ==================== ADMIN QUERIES ====================
export const useAdminQueries = () => {
  return useQuery({
    queryKey: adminKeys.queries(),
    queryFn: () => adminApi.getAdminQueries(),
  });
};

export const useUpdateAdminQuery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ queryId, data }: { queryId: string; data: any }) =>
      adminApi.updateAdminQuery(queryId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.queries() });
      toast.success('Query updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update query');
    },
  });
};

// ==================== SUPER ADMIN - ADMINS ====================
export const useAdmins = () => {
  return useQuery({
    queryKey: adminKeys.admins(),
    queryFn: () => adminApi.getAdmins(),
  });
};

export const useAdmin = (adminId: string) => {
  return useQuery({
    queryKey: adminKeys.admin(adminId),
    queryFn: () => adminApi.getAdminById(adminId),
    enabled: !!adminId,
  });
};

export const useUpdateAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ adminId, data }: { adminId: string; data: any }) =>
      adminApi.updateAdmin(adminId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.admins() });
      queryClient.invalidateQueries({ queryKey: adminKeys.admin(variables.adminId) });
      toast.success('Admin updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update admin');
    },
  });
};

export const useDeleteAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (adminId: string) => adminApi.deleteAdmin(adminId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.admins() });
      toast.success('Admin deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete admin');
    },
  });
};

// ==================== SUPER ADMIN - SUBSCRIPTIONS ====================
export const useSuperAdminSubscriptions = () => {
  return useQuery({
    queryKey: adminKeys.subscriptions(),
    queryFn: () => adminApi.getSuperAdminSubscriptions(),
  });
};

export const useCreateSuperAdminSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => adminApi.createSuperAdminSubscription(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.subscriptions() });
      toast.success('Subscription created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create subscription');
    },
  });
};

export const useUpdateSuperAdminSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      adminApi.updateSuperAdminSubscription(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.subscriptions() });
      toast.success('Subscription updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update subscription');
    },
  });
};

// ==================== SUPER ADMIN - OVERVIEW & ANALYTICS ====================
export const useSuperAdminOverview = () => {
  return useQuery({
    queryKey: adminKeys.overview(),
    queryFn: () => adminApi.getSuperAdminOverview(),
  });
};

export const useSuperAdminAnalytics = () => {
  return useQuery({
    queryKey: adminKeys.analytics(),
    queryFn: () => adminApi.getSuperAdminAnalytics(),
  });
};

export const useSuperAdminActivities = () => {
  return useQuery({
    queryKey: adminKeys.activities(),
    queryFn: () => adminApi.getSuperAdminActivities(),
  });
};

// ==================== SUPER ADMIN - SETTINGS ====================
export const useSuperAdminSettings = () => {
  return useQuery({
    queryKey: adminKeys.settings(),
    queryFn: () => adminApi.getSuperAdminSettings(),
  });
};

export const useUpdateSuperAdminSetting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ key, data }: { key: string; data: any }) =>
      adminApi.updateSuperAdminSetting(key, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.settings() });
      toast.success('Setting updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update setting');
    },
  });
};

// ==================== REPORTING ====================
export const useAdminReportingDashboard = () => {
  return useQuery({
    queryKey: [...adminKeys.reporting(), 'admin'],
    queryFn: () => adminApi.getAdminReportingDashboard(),
  });
};

export const useSuperAdminReportingDashboard = () => {
  return useQuery({
    queryKey: [...adminKeys.reporting(), 'superadmin'],
    queryFn: () => adminApi.getSuperAdminReportingDashboard(),
  });
};

// ==================== SUPER ADMIN - CUSTOMERS ====================
export const useSuperAdminCustomers = (filters?: {
  search?: string;
  tier?: string;
  status?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: [...adminKeys.all, 'super-admin-customers', filters],
    queryFn: () => adminApi.getSuperAdminCustomers(filters),
  });
};

export const useDeleteSuperAdminCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminApi.deleteSuperAdminCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...adminKeys.all, 'super-admin-customers'] });
      toast.success('Customer deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete customer');
    },
  });
};

// ==================== SUPER ADMIN - REVENUE ====================
export const useSuperAdminRevenue = (dateRange?: { startDate?: string; endDate?: string }) => {
  return useQuery({
    queryKey: [...adminKeys.all, 'super-admin-revenue', dateRange],
    queryFn: () => adminApi.getSuperAdminRevenue(dateRange),
  });
};
