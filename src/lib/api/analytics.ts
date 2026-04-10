// Analytics API Services

import { apiClient } from './client';
import type { AnalyticsResponse } from '@/lib/types/analytics';

export const analyticsApi = {
  // Get overview statistics
  getOverview: async (): Promise<AnalyticsResponse> => {
    return apiClient.get('/analytics/overview');
  },
};