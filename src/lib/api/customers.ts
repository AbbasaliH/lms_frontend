// Customer API Services

import { apiClient } from './client';
import type { 
  Customer, 
  CustomerFilters, 
  CreateCustomerRequest, 
  UpdateCustomerRequest, 
  CustomerInteractionsResponse 
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
    const endpoint = `/admin/customers${query ? `?${query}` : ''}`;
    return apiClient.get(endpoint);
  },

  getCustomer: async (id: string) => {
    return apiClient.get(`/admin/customers/${id}`);
  },

  createCustomer: async (data: CreateCustomerRequest) => {
    return apiClient.post('/admin/customers', data);
  },

  updateCustomer: async (id: string, data: UpdateCustomerRequest) => {
    return apiClient.put(`/admin/customers/${id}`, data);
  },

  // Customer self endpoints
  getProfile: async () => {
    return apiClient.get('/customer/profile');
  },

  updateProfile: async (data: UpdateCustomerRequest) => {
    return apiClient.put('/customer/profile', data);
  },

  getInteractions: async () => {
    return apiClient.get('/customer/interactions');
  },

  // Admin interactions
  getAllInteractions: async () => {
    return apiClient.get('/admin/customer-interactions');
  },
};

