// Admin & Super Admin API Services

import { apiClient } from './client';

export const adminApi = {
  // ==================== ADMIN ====================
  getAdminDashboard: async () => {
    return apiClient.get('/admin/dashboard');
  },

  getPendingUsers: async () => {
    return apiClient.get('/admin/pending-users');
  },

  approveUser: async (userId: string) => {
    return apiClient.patch(`/admin/users/${userId}/approve`);
  },

  getAdminQueries: async () => {
    return apiClient.get('/admin/queries');
  },

  updateAdminQuery: async (queryId: string, data: any) => {
    return apiClient.put(`/admin/queries/${queryId}`, data);
  },

  // ==================== SUPER ADMIN ====================
  getAdmins: async () => {
    return apiClient.get('/super-admin/admins');
  },

  getAdminById: async (adminId: string) => {
    return apiClient.get(`/super-admin/admins/${adminId}`);
  },

  updateAdmin: async (adminId: string, data: any) => {
    return apiClient.put(`/super-admin/admins/${adminId}`, data);
  },

  deleteAdmin: async (adminId: string) => {
    return apiClient.delete(`/super-admin/admins/${adminId}`);
  },

  getSuperAdminSubscriptions: async () => {
    return apiClient.get('/super-admin/subscriptions');
  },

  createSuperAdminSubscription: async (data: any) => {
    return apiClient.post('/super-admin/subscriptions', data);
  },

  updateSuperAdminSubscription: async (id: string, data: any) => {
    return apiClient.put(`/super-admin/subscriptions/${id}`, data);
  },

  getSuperAdminOverview: async () => {
    return apiClient.get('/super-admin/overview');
  },

  getSuperAdminAnalytics: async () => {
    return apiClient.get('/super-admin/analytics');
  },

  getSuperAdminActivities: async () => {
    return apiClient.get('/super-admin/activities');
  },

  getSuperAdminSettings: async () => {
    return apiClient.get('/super-admin/settings');
  },

  updateSuperAdminSetting: async (key: string, data: any) => {
    return apiClient.put(`/super-admin/settings/${key}`, data);
  },

  // ==================== REPORTING ====================
  getAdminReportingDashboard: async () => {
    return apiClient.get('/reporting/admin/dashboard');
  },

  getSuperAdminReportingDashboard: async () => {
    return apiClient.get('/reporting/superadmin/dashboard');
  },

  // ==================== SUPER ADMIN - CUSTOMERS ====================
  getSuperAdminCustomers: async (filters?: {
    search?: string;
    tier?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) => {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.tier) params.append('tier', filters.tier);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    const query = params.toString();
    return apiClient.get(`/super-admin/customers${query ? `?${query}` : ''}`);
  },

  deleteSuperAdminCustomer: async (id: string) => {
    return apiClient.delete(`/super-admin/customers/${id}`);
  },

  // ==================== SUPER ADMIN - REVENUE ====================
  getSuperAdminRevenue: async (dateRange?: { startDate?: string; endDate?: string }) => {
    const params = new URLSearchParams();
    if (dateRange?.startDate) params.append('startDate', dateRange.startDate);
    if (dateRange?.endDate) params.append('endDate', dateRange.endDate);
    const query = params.toString();
    return apiClient.get(`/super-admin/revenue${query ? `?${query}` : ''}`);
  },
};
