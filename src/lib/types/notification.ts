// Notification System Types

// ==================== ENUMS ====================
export enum NotificationType {
  INFO = 'INFO',
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  ORDER_UPDATE = 'ORDER_UPDATE',
  PAYMENT = 'PAYMENT',
  DELIVERY = 'DELIVERY',
  PROMOTION = 'PROMOTION',
  SYSTEM = 'SYSTEM',
  REMINDER = 'REMINDER'
}

export enum NotificationPriority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

// ==================== MAIN TYPES ====================
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  isRead: boolean;
  isSent: boolean;
  sentAt: string | null;
  readAt: string | null;
  metadata?: Record<string, any> | null;
  relatedType?: string | null;
  relatedId?: string | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    fullName: string;
    email: string;
  };
}

// ==================== STATISTICS ====================
export interface NotificationStats {
  total: number;
  unread: number;
  read: number;
  byType: Array<{
    type: NotificationType;
    count: number;
  }>;
  byPriority: Array<{
    priority: NotificationPriority;
    count: number;
  }>;
}

// ==================== REQUEST TYPES ====================
export interface CreateNotificationRequest {
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  metadata?: Record<string, any>;
  relatedType?: string;
  relatedId?: string;
}

export interface BroadcastNotificationRequest {
  userIds: string[];
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  metadata?: Record<string, any>;
}

export interface MarkAsReadRequest {
  ids: string[];
}

export interface DeleteNotificationsRequest {
  ids: string[];
}

// ==================== FILTER TYPES ====================
export interface NotificationFilters {
  page?: number;
  limit?: number;
  isRead?: boolean;
  type?: NotificationType;
  priority?: NotificationPriority;
  fromDate?: string;
  toDate?: string;
}

// ==================== RESPONSE TYPES ====================
export interface NotificationsResponse {
  success: boolean;
  data: {
    notifications: Notification[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      hasMore: boolean;
    };
  };
}

export interface UnreadCountResponse {
  success: boolean;
  data: {
    count: number;
  };
}

export interface NotificationStatsResponse {
  success: boolean;
  data: NotificationStats;
}

export interface NotificationResponse {
  success: boolean;
  message: string;
  data: Notification;
}

export interface MarkAsReadResponse {
  success: boolean;
  message: string;
  data: {
    count: number;
  };
}

export interface DeleteNotificationsResponse {
  success: boolean;
  message: string;
  data: {
    count: number;
  };
}

export interface BroadcastNotificationResponse {
  success: boolean;
  message: string;
  data: Notification[];
}
