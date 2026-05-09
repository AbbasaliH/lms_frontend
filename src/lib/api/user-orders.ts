// Base Orders API Services (for /orders/* endpoints)

import { apiClient } from './client';
import type {
  ApiOrder,
  ApiResponse,
  OrderFilters,
  CreateOrderRequest,
  UpdateOrderRequest,
  OrderStatusUpdateRequest,
  AssignDeliveryBoyRequest,
  OrdersPaginatedResponse,
  OrderDashboardStats,
  StatusCounts,
  RevenueAnalytics,
  OrderCountResponse,
  HasPendingOrdersResponse,
} from '@/lib/types/order';

const BASE_URL = '/orders';

export const userOrdersApi = {
  // ==================== DASHBOARD & ANALYTICS ====================
  getDashboard: async (): Promise<ApiResponse<OrderDashboardStats>> => {
    return apiClient.get(`${BASE_URL}/dashboard`);
  },

  getStatusCounts: async (): Promise<ApiResponse<StatusCounts>> => {
    return apiClient.get(`${BASE_URL}/status-counts`);
  },

  getRecentOrders: async (limit: number = 10): Promise<ApiResponse<ApiOrder[]>> => {
    return apiClient.get(`${BASE_URL}/recent?limit=${limit}`);
  },

  getRevenueAnalytics: async (dateRange?: { fromDate?: string; toDate?: string }): Promise<ApiResponse<RevenueAnalytics>> => {
    const queryParams = new URLSearchParams();
    if (dateRange?.fromDate) queryParams.append('fromDate', dateRange.fromDate);
    if (dateRange?.toDate) queryParams.append('toDate', dateRange.toDate);
    const queryString = queryParams.toString();
    return apiClient.get(`${BASE_URL}/revenue-analytics${queryString ? `?${queryString}` : ''}`);
  },

  // ==================== ORDERS CRUD ====================
  getOrders: async (filters: OrderFilters = {}): Promise<ApiResponse<OrdersPaginatedResponse>> => {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    const queryString = queryParams.toString();
    return apiClient.get(`${BASE_URL}${queryString ? `?${queryString}` : ''}`);
  },

  getOrderById: async (id: string): Promise<ApiResponse<ApiOrder>> => {
    return apiClient.get(`${BASE_URL}/${id}`);
  },

  createOrder: async (data: CreateOrderRequest): Promise<ApiResponse<ApiOrder>> => {
    return apiClient.post(BASE_URL, data);
  },

  updateOrder: async (id: string, data: UpdateOrderRequest): Promise<ApiResponse<ApiOrder>> => {
    return apiClient.put(`${BASE_URL}/${id}`, data);
  },

  updateOrderStatus: async (id: string, data: OrderStatusUpdateRequest): Promise<ApiResponse<ApiOrder>> => {
    return apiClient.patch(`${BASE_URL}/${id}/status`, data);
  },

  assignDeliveryBoy: async (id: string, data: AssignDeliveryBoyRequest): Promise<ApiResponse<ApiOrder>> => {
    return apiClient.patch(`${BASE_URL}/${id}/assign-delivery-boy`, data);
  },

  cancelOrder: async (id: string): Promise<ApiResponse<ApiOrder>> => {
    return apiClient.patch(`${BASE_URL}/${id}/cancel`);
  },

  // ==================== USER ORDERS ====================
  getOrdersByUserId: async (userId: string): Promise<ApiResponse<ApiOrder[]>> => {
    return apiClient.get(`${BASE_URL}/user/${userId}`);
  },

  getOrderCountByUser: async (userId: string): Promise<ApiResponse<OrderCountResponse>> => {
    return apiClient.get(`${BASE_URL}/user/${userId}/count`);
  },

  hasPendingOrders: async (userId: string): Promise<ApiResponse<HasPendingOrdersResponse>> => {
    return apiClient.get(`${BASE_URL}/user/${userId}/has-pending`);
  },

  // ==================== DELIVERY BOY ORDERS ====================
  getOrdersByDeliveryBoy: async (deliveryBoyId: string): Promise<ApiResponse<ApiOrder[]>> => {
    return apiClient.get(`${BASE_URL}/delivery-boy/${deliveryBoyId}`);
  },
};
