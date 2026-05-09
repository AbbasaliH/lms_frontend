// Delivery Boy API Services

import { apiClient } from './client';
import type {
  DeliveryBoysResponse,
  DeliveryBoyResponse,
  CreateDeliveryBoyRequest,
  UpdateDeliveryBoyRequest,
  DeliveryBoyFilters,
  DeliveryBoyPagination,
  AssignOrderRequest,
  UpdateStatusRequest,
  DeliveryBoyStatus,
} from '../types/delivery-boy';

export const deliveryBoyApi = {
  // Get all delivery boys with filters and pagination
  getDeliveryBoys: async (
    filters?: DeliveryBoyFilters,
    pagination?: DeliveryBoyPagination
  ): Promise<DeliveryBoysResponse> => {
    const params = new URLSearchParams();
    
    if (pagination?.page) params.append('page', pagination.page.toString());
    if (pagination?.limit) params.append('limit', pagination.limit.toString());
    if (filters?.status) params.append('status', filters.status);
    if (filters?.vehicleType) params.append('vehicleType', filters.vehicleType);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.isAvailable !== undefined) params.append('isAvailable', filters.isAvailable.toString());

    const queryString = params.toString();
    const endpoint = queryString ? `/admin/delivery-boys?${queryString}` : '/admin/delivery-boys';
    
    return apiClient.get<DeliveryBoysResponse>(endpoint);
  },

  // Get single delivery boy details
  getDeliveryBoy: async (id: string): Promise<DeliveryBoyResponse> => {
    return apiClient.get<DeliveryBoyResponse>(`/admin/delivery-boys/${id}`);
  },

  // Create new delivery boy
  createDeliveryBoy: async (
    data: CreateDeliveryBoyRequest
  ): Promise<DeliveryBoyResponse> => {
    return apiClient.post<DeliveryBoyResponse>('/admin/delivery-boys', data);
  },

  // Update delivery boy details
  updateDeliveryBoy: async (
    id: string,
    data: UpdateDeliveryBoyRequest
  ): Promise<DeliveryBoyResponse> => {
    return apiClient.put<DeliveryBoyResponse>(`/admin/delivery-boys/${id}`, data);
  },

  // Update delivery boy status
  updateDeliveryBoyStatus: async (
    id: string,
    data: UpdateStatusRequest
  ): Promise<DeliveryBoyResponse> => {
    return apiClient.patch<DeliveryBoyResponse>(
      `/admin/delivery-boys/${id}/status`,
      data
    );
  },

  // Delete delivery boy
  deleteDeliveryBoy: async (id: string): Promise<{ success: boolean; message: string }> => {
    return apiClient.delete<{ success: boolean; message: string }>(
      `/admin/delivery-boys/${id}`
    );
  },

  // Assign order to delivery boy
  assignOrder: async (data: AssignOrderRequest): Promise<{ success: boolean; message: string }> => {
    return apiClient.post<{ success: boolean; message: string }>(
      '/admin/orders/assign',
      data
    );
  },

  // ========== DELIVERY BOY ROLE ENDPOINTS ==========

  // Get own profile
  getProfile: async (): Promise<DeliveryBoyResponse> => {
    return apiClient.get<DeliveryBoyResponse>('/delivery-boy/profile');
  },

  // Toggle availability
  toggleAvailability: async (isAvailable: boolean): Promise<{ success: boolean; message: string }> => {
    return apiClient.patch<{ success: boolean; message: string }>('/delivery-boy/availability', { isAvailable });
  },

  // Update current location
  updateLocation: async (lat: number, lng: number): Promise<{ success: boolean; message: string }> => {
    return apiClient.patch<{ success: boolean; message: string }>('/delivery-boy/location', { lat, lng });
  },

  // Get assigned orders
  getAssignedOrders: async (filters?: { status?: string; page?: number; limit?: number }): Promise<any> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    const query = params.toString();
    const endpoint = query ? `/delivery-boy/orders?${query}` : '/delivery-boy/orders';
    return apiClient.get(endpoint);
  },

  // Get earnings summary
  getEarnings: async (): Promise<any> => {
    return apiClient.get('/delivery-boy/earnings');
  },

  // Get performance stats
  getStats: async (): Promise<any> => {
    return apiClient.get('/delivery-boy/stats');
  },

  // Get today's schedule
  getSchedule: async (): Promise<any> => {
    return apiClient.get('/delivery-boy/schedule');
  },

  // Update order status (delivery boy)
  updateOrderStatus: async (data: { orderId: string; status: string }): Promise<{ success: boolean; message: string }> => {
    return apiClient.put('/delivery-boy/orders/status', data);
  },
};

