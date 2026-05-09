// Customer API Services

import { apiClient } from './client';
import type { 
  Customer, 
  CustomerFilters, 
  CreateCustomerRequest, 
  UpdateCustomerRequest, 
  // CustomerInteractionsResponse 
} from '../types/customer';

export const customerApi = {
  // Admin endpoints
  getCustomers: async (filters?: CustomerFilters) => {
    const params = new URLSearchParams();
    if (filters?.tier) params.append('tier', filters.tier);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    const query = params.toString();
    const endpoint = `/customers${query ? `?${query}` : ''}`;
    return apiClient.get(endpoint);
  },

  getCustomer: async (id: string) => {
    return apiClient.get(`/customers/${id}`);
  },

  createCustomer: async (data: CreateCustomerRequest) => {
    return apiClient.post('/customers', data);
  },

  updateCustomer: async (id: string, data: UpdateCustomerRequest) => {
    return apiClient.put(`/customers/${id}`, data);
  },

  deleteCustomer: async (id: string) => {
    return apiClient.delete(`/customers/${id}`);
  },

  updateCustomerStatus: async (id: string, status: string) => {
    return apiClient.patch(`/customers/${id}/status`, { status });
  },

  updateCustomerTier: async (id: string, tier: string) => {
    return apiClient.patch(`/customers/${id}/tier`, { tier });
  },

  updateLoyaltyPoints: async (id: string, points: number) => {
    return apiClient.patch(`/customers/${id}/loyalty-points`, { points });
  },

  verifyCustomer: async (id: string) => {
    return apiClient.patch(`/customers/${id}/verify`);
  },

  getCustomerDashboardStats: async () => {
    return apiClient.get('/customers/dashboard');
  },

  getCustomerLTV: async (customerId: string) => {
    return apiClient.get(`/customers/${customerId}/ltv`);
  },

  // Customer self endpoints (needs userId for profile lookup or handled via auth token on /profile/me)
  getProfileByUserId: async (userId: string) => {
    return apiClient.get(`/customers/user/${userId}`);
  },

  updateProfile: async (id: string, data: UpdateCustomerRequest) => {
    return apiClient.put(`/customers/${id}`, data);
  },

  getInteractions: async () => {
    return apiClient.get('/customers/interactions/all');
  },

  createInteraction: async (data: any) => {
    return apiClient.post('/customers/interactions', data);
  },

  updateInteractionStatus: async (id: string, status: string) => {
    return apiClient.patch(`/customers/interactions/${id}/status`, { status });
  },

  assignInteraction: async (id: string, assignedTo: string) => {
    return apiClient.patch(`/customers/interactions/${id}/assign`, { assignedTo });
  },

  // ==================== ANALYTICS ====================
  getTopCustomers: async () => {
    return apiClient.get('/customers/top-customers');
  },

  getCustomerSegments: async () => {
    return apiClient.get('/customers/segments');
  },

  getChurnRiskCustomers: async () => {
    return apiClient.get('/customers/churn-risk');
  },
};
