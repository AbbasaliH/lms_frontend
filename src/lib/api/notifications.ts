// Notification API Services

import { apiClient } from './client';
import type {
  Notification,
  NotificationFilters,
  CreateNotificationRequest,
  BroadcastNotificationRequest,
  MarkAsReadRequest,
  DeleteNotificationsRequest,
  NotificationsResponse,
  UnreadCountResponse,
  NotificationStatsResponse,
  NotificationResponse,
  MarkAsReadResponse,
  DeleteNotificationsResponse,
  BroadcastNotificationResponse,
} from '@/lib/types/notification';

const BASE_URL = '/notification';

export const notificationsApi = {
  // ==================== USER ENDPOINTS ====================
  
  // Get my notifications with filters
  getMyNotifications: async (
    filters: NotificationFilters = {}
  ): Promise<NotificationsResponse> => {
    const queryParams = new URLSearchParams();
    
    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.limit) queryParams.append('limit', filters.limit.toString());
    if (filters.isRead !== undefined) queryParams.append('isRead', filters.isRead.toString());
    if (filters.type) queryParams.append('type', filters.type);
    if (filters.priority) queryParams.append('priority', filters.priority);
    if (filters.fromDate) queryParams.append('fromDate', filters.fromDate);
    if (filters.toDate) queryParams.append('toDate', filters.toDate);
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `${BASE_URL}/my?${queryString}` : `${BASE_URL}/my`;
    
    return apiClient.get(endpoint);
  },

  // Get unread count
  getUnreadCount: async (): Promise<UnreadCountResponse> => {
    return apiClient.get(`${BASE_URL}/my/unread-count`);
  },

  // Get notification statistics
  getMyStats: async (): Promise<NotificationStatsResponse> => {
    return apiClient.get(`${BASE_URL}/my/stats`);
  },

  // Get notification by ID
  getNotificationById: async (id: string): Promise<NotificationResponse> => {
    return apiClient.get(`${BASE_URL}/${id}`);
  },

  // Mark notification as read
  markAsRead: async (id: string): Promise<NotificationResponse> => {
    return apiClient.put(`${BASE_URL}/${id}/read`);
  },

  // Mark multiple notifications as read
  markMultipleAsRead: async (
    data: MarkAsReadRequest
  ): Promise<MarkAsReadResponse> => {
    return apiClient.put(`${BASE_URL}/mark-read`, data);
  },

  // Mark all notifications as read
  markAllAsRead: async (): Promise<MarkAsReadResponse> => {
    return apiClient.put(`${BASE_URL}/my/mark-all-read`);
  },

  // Delete notification
  deleteNotification: async (id: string): Promise<NotificationResponse> => {
    return apiClient.delete(`${BASE_URL}/${id}`);
  },

  // Delete multiple notifications
  deleteMultiple: async (
    data: DeleteNotificationsRequest
  ): Promise<DeleteNotificationsResponse> => {
    return apiClient.delete(`${BASE_URL}`, {
      body: JSON.stringify(data),
    });
  },

  // ==================== ADMIN ENDPOINTS ====================
  
  // Get all notifications (admin)
  getAllNotifications: async (
    filters: NotificationFilters = {}
  ): Promise<NotificationsResponse> => {
    const queryParams = new URLSearchParams();
    
    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.limit) queryParams.append('limit', filters.limit.toString());
    if (filters.isRead !== undefined) queryParams.append('isRead', filters.isRead.toString());
    if (filters.type) queryParams.append('type', filters.type);
    if (filters.priority) queryParams.append('priority', filters.priority);
    if (filters.fromDate) queryParams.append('fromDate', filters.fromDate);
    if (filters.toDate) queryParams.append('toDate', filters.toDate);
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `${BASE_URL}?${queryString}` : BASE_URL;
    
    return apiClient.get(endpoint);
  },

  // Create notification (admin)
  createNotification: async (
    data: CreateNotificationRequest
  ): Promise<NotificationResponse> => {
    return apiClient.post(`${BASE_URL}`, data);
  },

  // Broadcast notification to multiple users (admin)
  broadcastNotification: async (
    data: BroadcastNotificationRequest
  ): Promise<BroadcastNotificationResponse> => {
    return apiClient.post(`${BASE_URL}/broadcast`, data);
  },

  // Test email notification (admin)
  testEmail: async (data: { to: string; subject: string; message: string }) => {
    return apiClient.post(`${BASE_URL}/test/email`, data);
  },

  // Test SMS notification (admin)
  testSms: async (data: { to: string; message: string }) => {
    return apiClient.post(`${BASE_URL}/test/sms`, data);
  },
};
