// Orders API Services

import { apiClient } from './client';
import type { OrdersResponse, ApiOrder } from '../types/api';

export const ordersApi = {
  getOrders: async (filters?: { search?: string; status?: string; page?: number; limit?: number }): Promise<OrdersResponse> => {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.status && filters.status !== 'all') params.append('status', filters.status);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    const query = params.toString();
    return apiClient.get<OrdersResponse>(`/admin/orders${query ? `?${query}` : ''}`);
  },

  createOrder: async (data: any): Promise<{ success: boolean; data: ApiOrder }> => {
    return apiClient.post<{ success: boolean; data: ApiOrder }>('/admin/orders', data);
  },

  createOrder: async (data: any): Promise<{ success: boolean; data: ApiOrder }> => {
    return apiClient.post<{ success: boolean; data: ApiOrder }>('/orders', data);
  },

  updateOrderStatus: async (orderId: string, status: string): Promise<{ success: boolean; data: ApiOrder }> => {
    return apiClient.patch<{ success: boolean; data: ApiOrder }>(`/admin/orders/${orderId}/status`, { status });
  },

  cancelOrder: async (orderId: string, reason?: string): Promise<{ success: boolean; data: ApiOrder }> => {
    return apiClient.patch<{ success: boolean; data: ApiOrder }>(`/admin/orders/${orderId}/cancel`, { reason });
  },

  deleteOrder: async (orderId: string): Promise<{ success: boolean; message: string }> => {
    return apiClient.delete<{ success: boolean; message: string }>(`/admin/orders/${orderId}`);
  },

  assignDeliveryBoy: async (orderId: string, deliveryBoyId: string): Promise<{ success: boolean; data: ApiOrder }> => {
    return apiClient.patch<{ success: boolean; data: ApiOrder }>(`/admin/orders/${orderId}/assign`, { deliveryBoyId });
  },
};