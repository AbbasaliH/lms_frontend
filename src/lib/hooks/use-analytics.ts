// Analytics Hooks

import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '@/lib/api/analytics';

export const useAnalyticsOverview = () => {
  return useQuery({
    queryKey: ['analytics-overview'],
    queryFn: () => analyticsApi.getOverview(),
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
    staleTime: 20000, // Consider data stale after 20 seconds
  });
};