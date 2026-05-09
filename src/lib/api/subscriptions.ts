// Subscription API Services

import { apiClient } from './client';
import type {
  Subscription,
  SubscriptionFilters,
  CreateSubscriptionRequest,
  UpdateSubscriptionRequest,
  AssignSubscriptionRequest,
  SubscriptionsResponse,
  SubscriptionResponse,
  SubscriptionStatsResponse,
} from '../types/subscription';

export const subscriptionsApi = {
  // Public endpoints
  getActiveSubscriptions: async (): Promise<SubscriptionResponse[]> => {
    return apiClient.get<SubscriptionResponse[]>('/subscriptions/active');
  },

  getSubscriptionById: async (id: string): Promise<SubscriptionResponse> => {
    return apiClient.get<SubscriptionResponse>(`/subscriptions/${id}`);
  },

  // Admin/SuperAdmin endpoints
  getAllSubscriptions: async (filters: SubscriptionFilters = {}): Promise<SubscriptionsResponse> => {
    const params = new URLSearchParams();

    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.status) params.append('status', filters.status);

    const queryString = params.toString();
    const endpoint = queryString ? `/subscriptions?${queryString}` : '/subscriptions';

    return apiClient.get<SubscriptionsResponse>(endpoint);
  },

  createSubscription: async (data: CreateSubscriptionRequest): Promise<SubscriptionResponse> => {
    return apiClient.post<SubscriptionResponse>('/subscriptions', data);
  },

  updateSubscription: async (id: string, data: UpdateSubscriptionRequest): Promise<SubscriptionResponse> => {
    return apiClient.put<SubscriptionResponse>(`/subscriptions/${id}`, data);
  },

  deleteSubscription: async (id: string): Promise<{ success: boolean; message: string }> => {
    return apiClient.delete<{ success: boolean; message: string }>(`/subscriptions/${id}`);
  },

  toggleSubscriptionStatus: async (id: string): Promise<SubscriptionResponse> => {
    return apiClient.patch<SubscriptionResponse>(`/subscriptions/${id}/toggle-status`);
  },

  assignToUser: async (data: AssignSubscriptionRequest): Promise<{ success: boolean; message: string }> => {
    return apiClient.post<{ success: boolean; message: string }>('/subscriptions/assign', data);
  },

  removeFromUser: async (userId: string): Promise<{ success: boolean; message: string }> => {
    return apiClient.delete<{ success: boolean; message: string }>(`/subscriptions/remove/${userId}`);
  },

  getStats: async (): Promise<SubscriptionStatsResponse> => {
    return apiClient.get<SubscriptionStatsResponse>('/subscriptions/stats/overview');
  },
};
