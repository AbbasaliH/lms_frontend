// Subscription Types and Enums

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export interface Subscription {
  id: string;
  name: string;
  price: number;
  duration: number;
  features: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: SubscriptionStatus;
}

export interface CreateSubscriptionRequest {
  name: string;
  price: number;
  duration: number;
  features: string[];
}

export interface UpdateSubscriptionRequest {
  name?: string;
  price?: number;
  duration?: number;
  features?: string[];
}

export interface AssignSubscriptionRequest {
  userId: string;
  subscriptionId: string;
}

export interface SubscriptionsResponse {
  success: boolean;
  data: {
    subscriptions: Subscription[];
    pagination: SubscriptionsPagination;
  };
}

export interface SubscriptionResponse {
  success: boolean;
  message: string;
  data: Subscription;
}

export interface SubscriptionsPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SubscriptionStatsData {
  totalSubscriptions: number;
  activeSubscriptions: number;
  inactiveSubscriptions: number;
  totalRevenue: number;
  totalAssignedUsers: number;
}

export interface SubscriptionStatsResponse {
  success: boolean;
  data: SubscriptionStatsData;
}
