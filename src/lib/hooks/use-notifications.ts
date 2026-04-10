// Notification Hooks

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { notificationsApi } from '@/lib/api/notifications';
import type {
  NotificationFilters,
  CreateNotificationRequest,
  BroadcastNotificationRequest,
  MarkAsReadRequest,
  DeleteNotificationsRequest,
} from '@/lib/types/notification';

// ==================== USER HOOKS ====================

// Get my notifications
export const useMyNotifications = (filters: NotificationFilters = {}) => {
  return useQuery({
    queryKey: ['my-notifications', filters],
    queryFn: () => notificationsApi.getMyNotifications(filters),
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

// Get unread count
export const useUnreadCount = () => {
  return useQuery({
    queryKey: ['unread-count'],
    queryFn: () => notificationsApi.getUnreadCount(),
    refetchInterval: 15000, // Refetch every 15 seconds for real-time updates
  });
};

// Get notification statistics
export const useNotificationStats = () => {
  return useQuery({
    queryKey: ['notification-stats'],
    queryFn: () => notificationsApi.getMyStats(),
  });
};

// Get notification by ID
export const useNotification = (id: string) => {
  return useQuery({
    queryKey: ['notification', id],
    queryFn: () => notificationsApi.getNotificationById(id),
    enabled: !!id,
  });
};

// Mark as read
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationsApi.markAsRead(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['my-notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-count'] });
      queryClient.invalidateQueries({ queryKey: ['notification-stats'] });
      queryClient.invalidateQueries({ queryKey: ['notification', response.data.id] });
    },
    onError: (error: any) => {
      const errorMsg = error.response?.data?.error || error.message || 'Failed to mark as read';
      toast.error(errorMsg);
    },
  });
};

// Mark multiple as read
export const useMarkMultipleAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MarkAsReadRequest) =>
      notificationsApi.markMultipleAsRead(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['my-notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-count'] });
      queryClient.invalidateQueries({ queryKey: ['notification-stats'] });
      toast.success(response.message || 'Notifications marked as read');
    },
    onError: (error: any) => {
      const errorMsg = error.response?.data?.error || error.message || 'Failed to mark as read';
      toast.error(errorMsg);
    },
  });
};

// Mark all as read
export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationsApi.markAllAsRead(),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['my-notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-count'] });
      queryClient.invalidateQueries({ queryKey: ['notification-stats'] });
      toast.success(response.message || 'All notifications marked as read');
    },
    onError: (error: any) => {
      const errorMsg = error.response?.data?.error || error.message || 'Failed to mark all as read';
      toast.error(errorMsg);
    },
  });
};

// Delete notification
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationsApi.deleteNotification(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['my-notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-count'] });
      queryClient.invalidateQueries({ queryKey: ['notification-stats'] });
      toast.success(response.message || 'Notification deleted');
    },
    onError: (error: any) => {
      const errorMsg = error.response?.data?.error || error.message || 'Failed to delete notification';
      toast.error(errorMsg);
    },
  });
};

// Delete multiple notifications
export const useDeleteMultipleNotifications = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DeleteNotificationsRequest) =>
      notificationsApi.deleteMultiple(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['my-notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-count'] });
      queryClient.invalidateQueries({ queryKey: ['notification-stats'] });
      toast.success(response.message || 'Notifications deleted');
    },
    onError: (error: any) => {
      const errorMsg = error.response?.data?.error || error.message || 'Failed to delete notifications';
      toast.error(errorMsg);
    },
  });
};

// ==================== ADMIN HOOKS ====================

// Get all notifications (admin)
export const useAllNotifications = (filters: NotificationFilters = {}) => {
  return useQuery({
    queryKey: ['all-notifications', filters],
    queryFn: () => notificationsApi.getAllNotifications(filters),
  });
};

// Create notification (admin)
export const useCreateNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateNotificationRequest) =>
      notificationsApi.createNotification(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['all-notifications'] });
      queryClient.invalidateQueries({ queryKey: ['my-notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-count'] });
      toast.success(response.message || 'Notification created successfully');
    },
    onError: (error: any) => {
      const errorMsg = error.response?.data?.error || error.message || 'Failed to create notification';
      toast.error(errorMsg);
    },
  });
};

// Broadcast notification (admin)
export const useBroadcastNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BroadcastNotificationRequest) =>
      notificationsApi.broadcastNotification(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['all-notifications'] });
      queryClient.invalidateQueries({ queryKey: ['my-notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-count'] });
      toast.success(response.message || 'Notification broadcasted successfully');
    },
    onError: (error: any) => {
      const errorMsg = error.response?.data?.error || error.message || 'Failed to broadcast notification';
      toast.error(errorMsg);
    },
  });
};
