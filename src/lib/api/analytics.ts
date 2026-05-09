// Analytics API Services

import { apiClient } from './client';
import type { AnalyticsResponse } from '@/lib/types/analytics';

export const analyticsApi = {
  // Get overview statistics
  getOverview: async (startDate?: string, endDate?: string): Promise<AnalyticsResponse> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const query = params.toString();
    return apiClient.get(`/analytics/overview${query ? `?${query}` : ''}`);
  },

  // ==================== COMPREHENSIVE & SEGMENTS ====================
  getComprehensive: async (startDate?: string, endDate?: string): Promise<any> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const query = params.toString();
    return apiClient.get(`/analytics/comprehensive${query ? `?${query}` : ''}`);
  },

  // ==================== REVENUE ====================
  getRevenue: async (): Promise<any> => {
    return apiClient.get('/analytics/revenue');
  },

  getDailyRevenue: async (days: number = 30): Promise<any> => {
    return apiClient.get(`/analytics/revenue/daily?days=${days}`);
  },

  // ==================== ORDERS ====================
  getOrdersAnalytics: async (): Promise<any> => {
    return apiClient.get('/analytics/orders');
  },

  getOrdersFunnel: async (): Promise<any> => {
    return apiClient.get('/analytics/orders/funnel');
  },

  // ==================== USERS & PRODUCTS ====================
  getUsersAnalytics: async (): Promise<any> => {
    return apiClient.get('/analytics/users');
  },

  getProductsAnalytics: async (): Promise<any> => {
    return apiClient.get('/analytics/products');
  },

  // ==================== DELIVERY & FEEDBACK ====================
  getDeliveryBoysAnalytics: async (): Promise<any> => {
    return apiClient.get('/analytics/delivery-boys');
  },

  getFeedbackAnalytics: async (): Promise<any> => {
    return apiClient.get('/analytics/feedback');
  },

  // ==================== FINANCIAL & GEOGRAPHIC ====================
  getFinancialAnalytics: async (): Promise<any> => {
    return apiClient.get('/analytics/financial');
  },

  getGeographicAnalytics: async (): Promise<any> => {
    return apiClient.get('/analytics/geographic');
  },

  // ==================== QUERIES & SUBSCRIPTIONS ====================
  getQueriesAnalytics: async (): Promise<any> => {
    return apiClient.get('/analytics/queries');
  },

  getSubscriptionsAnalytics: async (): Promise<any> => {
    return apiClient.get('/analytics/subscriptions');
  },
};
