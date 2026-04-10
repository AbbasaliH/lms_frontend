// Orders API Services

import { apiClient } from './client';
import type { OrdersResponse, ApiOrder } from '../types/api';

export const ordersApi = {
  getOrders: async (): Promise<OrdersResponse> => {
    return apiClient.get<OrdersResponse>('/admin/orders');
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