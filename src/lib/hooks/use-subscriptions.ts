// Subscription Hooks

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionsApi } from '../api/subscriptions';
import type {
  SubscriptionFilters,
  CreateSubscriptionRequest,
  UpdateSubscriptionRequest,
  AssignSubscriptionRequest,
} from '../types/subscription';
import { toast } from 'sonner';

// Public hooks
export function useActiveSubscriptions() {
  return useQuery({
    queryKey: ['active-subscriptions'],
    queryFn: () => subscriptionsApi.getActiveSubscriptions(),
  });
}

export function useSubscription(id: string) {
  return useQuery({
    queryKey: ['subscription', id],
    queryFn: () => subscriptionsApi.getSubscriptionById(id),
    enabled: !!id,
  });
}

// Admin hooks
export function useSubscriptions(filters: SubscriptionFilters = {}) {
  return useQuery({
    queryKey: ['subscriptions', filters],
    queryFn: () => subscriptionsApi.getAllSubscriptions(filters),
  });
}

export function useSubscriptionStats() {
  return useQuery({
    queryKey: ['subscription-stats'],
    queryFn: () => subscriptionsApi.getStats(),
  });
}

export function useCreateSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSubscriptionRequest) => subscriptionsApi.createSubscription(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['subscription-stats'] });
      queryClient.invalidateQueries({ queryKey: ['active-subscriptions'] });
      toast.success('Subscription created successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to create subscription');
    },
  });
}

export function useUpdateSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSubscriptionRequest }) =>
      subscriptionsApi.updateSubscription(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['subscription-stats'] });
      queryClient.invalidateQueries({ queryKey: ['active-subscriptions'] });
      toast.success('Subscription updated successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to update subscription');
    },
  });
}

export function useDeleteSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => subscriptionsApi.deleteSubscription(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['subscription-stats'] });
      queryClient.invalidateQueries({ queryKey: ['active-subscriptions'] });
      toast.success('Subscription deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to delete subscription');
    },
  });
}

export function useToggleSubscriptionStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => subscriptionsApi.toggleSubscriptionStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['subscription-stats'] });
      queryClient.invalidateQueries({ queryKey: ['active-subscriptions'] });
      toast.success('Subscription status toggled successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to toggle subscription status');
    },
  });
}

export function useAssignSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AssignSubscriptionRequest) => subscriptionsApi.assignToUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['subscription-stats'] });
      toast.success('Subscription assigned successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to assign subscription');
    },
  });
}

export function useRemoveSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => subscriptionsApi.removeFromUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['subscription-stats'] });
      toast.success('Subscription removed successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to remove subscription');
    },
  });
}
