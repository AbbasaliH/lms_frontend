// Delivery Boy TanStack Query Hooks

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { deliveryBoyApi } from '../api/delivery-boy';
import type {
  DeliveryBoyFilters,
  DeliveryBoyPagination,
  CreateDeliveryBoyRequest,
  UpdateDeliveryBoyRequest,
  UpdateStatusRequest,
  AssignOrderRequest,
} from '../types/delivery-boy';

// Query Keys
export const deliveryBoyKeys = {
  all: ['deliveryBoys'] as const,
  lists: () => [...deliveryBoyKeys.all, 'list'] as const,
  list: (filters?: DeliveryBoyFilters, pagination?: DeliveryBoyPagination) =>
    [...deliveryBoyKeys.lists(), { filters, pagination }] as const,
  details: () => [...deliveryBoyKeys.all, 'detail'] as const,
  detail: (id: string) => [...deliveryBoyKeys.details(), id] as const,
};

// Get all delivery boys with filters
export const useDeliveryBoys = (
  filters?: DeliveryBoyFilters,
  pagination?: DeliveryBoyPagination
) => {
  return useQuery({
    queryKey: deliveryBoyKeys.list(filters, pagination),
    queryFn: () => deliveryBoyApi.getDeliveryBoys(filters, pagination),
    staleTime: 30 * 1000, // 30 seconds
  });
};

// Get single delivery boy
export const useDeliveryBoy = (id: string) => {
  return useQuery({
    queryKey: deliveryBoyKeys.detail(id),
    queryFn: () => deliveryBoyApi.getDeliveryBoy(id),
    enabled: !!id,
  });
};

// Create delivery boy
export const useCreateDeliveryBoy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDeliveryBoyRequest) =>
      deliveryBoyApi.createDeliveryBoy(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: deliveryBoyKeys.lists() });
      toast.success(response.message || 'Delivery boy created successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create delivery boy');
    },
  });
};

// Update delivery boy
export const useUpdateDeliveryBoy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDeliveryBoyRequest }) =>
      deliveryBoyApi.updateDeliveryBoy(id, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: deliveryBoyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: deliveryBoyKeys.detail(variables.id) });
      toast.success(response.message || 'Delivery boy updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update delivery boy');
    },
  });
};

// Update delivery boy status
export const useUpdateDeliveryBoyStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStatusRequest }) =>
      deliveryBoyApi.updateDeliveryBoyStatus(id, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: deliveryBoyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: deliveryBoyKeys.detail(variables.id) });
      toast.success(response.message || 'Status updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update status');
    },
  });
};

// Delete delivery boy
export const useDeleteDeliveryBoy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deliveryBoyApi.deleteDeliveryBoy(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: deliveryBoyKeys.lists() });
      toast.success(response.message || 'Delivery boy deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete delivery boy');
    },
  });
};

// Assign order to delivery boy
export const useAssignOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AssignOrderRequest) => deliveryBoyApi.assignOrder(data),
    onSuccess: (response) => {
      // Invalidate both delivery boys and orders queries
      queryClient.invalidateQueries({ queryKey: deliveryBoyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success(response.message || 'Order assigned successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to assign order');
    },
  });
};