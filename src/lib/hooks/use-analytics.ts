// Analytics Hooks

import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '@/lib/api/analytics';

export const useAnalyticsOverview = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ['analytics-overview', startDate, endDate],
    queryFn: () => analyticsApi.getOverview(startDate, endDate),
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
    staleTime: 20000, // Consider data stale after 20 seconds
  });
};

// ==================== COMPREHENSIVE & SEGMENTS ====================
export const useAnalyticsComprehensive = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ['analytics-comprehensive', startDate, endDate],
    queryFn: () => analyticsApi.getComprehensive(startDate, endDate),
  });
};

// ==================== REVENUE ====================
export const useAnalyticsRevenue = () => {
  return useQuery({
    queryKey: ['analytics-revenue'],
    queryFn: () => analyticsApi.getRevenue(),
  });
};

export const useAnalyticsDailyRevenue = (days: number = 30) => {
  return useQuery({
    queryKey: ['analytics-daily-revenue', days],
    queryFn: () => analyticsApi.getDailyRevenue(days),
  });
};

// ==================== ORDERS ====================
export const useAnalyticsOrders = () => {
  return useQuery({
    queryKey: ['analytics-orders'],
    queryFn: () => analyticsApi.getOrdersAnalytics(),
  });
};

export const useAnalyticsOrdersFunnel = () => {
  return useQuery({
    queryKey: ['analytics-orders-funnel'],
    queryFn: () => analyticsApi.getOrdersFunnel(),
  });
};

// ==================== USERS & PRODUCTS ====================
export const useAnalyticsUsers = () => {
  return useQuery({
    queryKey: ['analytics-users'],
    queryFn: () => analyticsApi.getUsersAnalytics(),
  });
};

export const useAnalyticsProducts = () => {
  return useQuery({
    queryKey: ['analytics-products'],
    queryFn: () => analyticsApi.getProductsAnalytics(),
  });
};

// ==================== DELIVERY & FEEDBACK ====================
export const useAnalyticsDeliveryBoys = () => {
  return useQuery({
    queryKey: ['analytics-delivery-boys'],
    queryFn: () => analyticsApi.getDeliveryBoysAnalytics(),
  });
};

export const useAnalyticsFeedback = () => {
  return useQuery({
    queryKey: ['analytics-feedback'],
    queryFn: () => analyticsApi.getFeedbackAnalytics(),
  });
};

// ==================== FINANCIAL & GEOGRAPHIC ====================
export const useAnalyticsFinancial = () => {
  return useQuery({
    queryKey: ['analytics-financial'],
    queryFn: () => analyticsApi.getFinancialAnalytics(),
  });
};

export const useAnalyticsGeographic = () => {
  return useQuery({
    queryKey: ['analytics-geographic'],
    queryFn: () => analyticsApi.getGeographicAnalytics(),
  });
};

// ==================== QUERIES & SUBSCRIPTIONS ====================
export const useAnalyticsQueries = () => {
  return useQuery({
    queryKey: ['analytics-queries'],
    queryFn: () => analyticsApi.getQueriesAnalytics(),
  });
};

export const useAnalyticsSubscriptions = () => {
  return useQuery({
    queryKey: ['analytics-subscriptions'],
    queryFn: () => analyticsApi.getSubscriptionsAnalytics(),
  });
};
