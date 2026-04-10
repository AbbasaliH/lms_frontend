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

export const useCustomerProfile = () => {
  return useQuery({
    queryKey: ['customerProfile'],
    queryFn: customerApi.getProfile,
  });
};

