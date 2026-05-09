// Customer TanStack Query Hooks

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { customerApi } from '../api/customers';

const customerKeys = {
  all: ['customers'] as const,
  lists: () => [...customerKeys.all, 'list'] as const,
};

export const useCustomers = (filters?: any) => {
  return useQuery({
    queryKey: customerKeys.lists(),
    queryFn: () => customerApi.getCustomers(filters),
    staleTime: 30 * 1000,
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: customerApi.createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      toast.success('Customer created');
    },
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => customerApi.updateCustomer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      toast.success('Customer updated');
    },
  });
};

export const useCustomerProfile = (userId?: string) => {
  return useQuery({
    queryKey: ['customerProfile', userId],
    queryFn: () => customerApi.getProfileByUserId(userId as string),
    enabled: !!userId,
  });
};

export const useUpdateCustomerStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => customerApi.updateCustomerStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      toast.success('Customer status updated');
    },
  });
};

export const useUpdateCustomerTier = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, tier }: { id: string; tier: string }) => customerApi.updateCustomerTier(id, tier),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      toast.success('Customer tier updated');
    },
  });
};

export const useUpdateLoyaltyPoints = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, points }: { id: string; points: number }) => customerApi.updateLoyaltyPoints(id, points),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      toast.success('Loyalty points updated');
    },
  });
};

export const useVerifyCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => customerApi.verifyCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      toast.success('Customer verified');
    },
  });
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => customerApi.deleteCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      toast.success('Customer deleted');
    },
  });
};

export const useCustomerDashboardStats = () => {
  return useQuery({
    queryKey: ['customerStats'],
    queryFn: customerApi.getCustomerDashboardStats,
  });
};

export const useCustomerLTV = (customerId: string) => {
  return useQuery({
    queryKey: ['customerLTV', customerId],
    queryFn: () => customerApi.getCustomerLTV(customerId),
    enabled: !!customerId,
  });
};

// Interactions

export const useCustomerInteractions = () => {
  return useQuery({
    queryKey: ['customerInteractions'],
    queryFn: customerApi.getInteractions,
  });
};

export const useCreateInteraction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: customerApi.createInteraction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customerInteractions'] });
      toast.success('Interaction created');
    },
  });
};

export const useUpdateInteractionStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => customerApi.updateInteractionStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customerInteractions'] });
      toast.success('Interaction status updated');
    },
  });
};

export const useAssignInteraction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, assignedTo }: { id: string; assignedTo: string }) => customerApi.assignInteraction(id, assignedTo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customerInteractions'] });
      toast.success('Interaction assigned');
    },
  });
};

// ==================== ANALYTICS ====================
export const useTopCustomers = () => {
  return useQuery({
    queryKey: ['top-customers'],
    queryFn: () => customerApi.getTopCustomers(),
  });
};

export const useCustomerSegments = () => {
  return useQuery({
    queryKey: ['customer-segments'],
    queryFn: () => customerApi.getCustomerSegments(),
  });
};

export const useChurnRiskCustomers = () => {
  return useQuery({
    queryKey: ['churn-risk-customers'],
    queryFn: () => customerApi.getChurnRiskCustomers(),
  });
};
