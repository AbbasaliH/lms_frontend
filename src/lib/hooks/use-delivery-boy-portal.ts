// Delivery Boy Portal TanStack Query Hooks

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { deliveryBoyApi } from '../api/delivery-boy';

// Query Keys for Delivery Boy Portal
export const deliveryBoyPortalKeys = {
  profile: ['deliveryBoyPortal', 'profile'] as const,
  orders: () => ['deliveryBoyPortal', 'orders'] as const,
  earnings: ['deliveryBoyPortal', 'earnings'] as const,
  stats: ['deliveryBoyPortal', 'stats'] as const,
  schedule: ['deliveryBoyPortal', 'schedule'] as const,
};

// Get own profile
export const useDeliveryBoyProfile = () => {
  return useQuery({
    queryKey: deliveryBoyPortalKeys.profile,
    queryFn: () => deliveryBoyApi.getProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get assigned orders
export const useDeliveryBoyOrders = (filters?: { status?: string; page?: number; limit?: number }) => {
  return useQuery({
    queryKey: deliveryBoyPortalKeys.orders(),
    queryFn: () => deliveryBoyApi.getAssignedOrders(filters),
    staleTime: 30 * 1000,
  });
};

// Get earnings
export const useDeliveryBoyEarnings = () => {
  return useQuery({
    queryKey: deliveryBoyPortalKeys.earnings,
    queryFn: () => deliveryBoyApi.getEarnings(),
    staleTime: 5 * 60 * 1000,
  });
};

// Get stats
export const useDeliveryBoyStats = () => {
  return useQuery({
    queryKey: deliveryBoyPortalKeys.stats,
    queryFn: () => deliveryBoyApi.getStats(),
    staleTime: 30 * 1000,
  });
};

// Toggle availability
export const useToggleAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (isAvailable: boolean) => deliveryBoyApi.toggleAvailability(isAvailable),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: deliveryBoyPortalKeys.profile });
      toast.success(response.message || 'Availability updated!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update availability');
    },
  });
};

// Update location
export const useUpdateLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ lat, lng }: { lat: number; lng: number }) => 
      deliveryBoyApi.updateLocation(lat, lng),
    onSuccess: () => {
      toast.success('Location updated!');
    },
  });
};

