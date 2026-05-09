// Base Orders Types (for /orders/* endpoints)

import type { ApiOrder, ApiOrderUser, ApiProduct, ApiDeliveryBoy } from './api';
import type { ApiResponse } from './expense';

// Re-export reused types for convenience
export type { ApiOrder, ApiOrderUser, ApiProduct, ApiDeliveryBoy };
export type { ApiResponse };

// ==================== ORDER STATUS ====================
export type OrderStatus = 'PENDING' | 'PROCESSING' | 'READY' | 'DELIVERED' | 'CANCELLED';

// ==================== FILTER TYPES ====================
export interface OrderFilters {
  userId?: string;
  status?: OrderStatus;
  fromDate?: string;
  toDate?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// ==================== REQUEST TYPES ====================
export interface OrderItem {
  productId: string;
  clothType: string;
  quantity: number;
  unitPrice: number;
  addOns?: string[];
}

export interface CreateOrderRequest {
  userId: string;
  productId: string;
  addressId?: string;
  items: OrderItem[];
  totalAmount: number;
  promoCodeId?: string;
  specialInstructions?: string;
}

export interface UpdateOrderRequest {
  userId?: string;
  productId?: string;
  addressId?: string;
  items?: OrderItem[];
  totalAmount?: number;
  promoCodeId?: string;
  specialInstructions?: string;
}

export interface OrderStatusUpdateRequest {
  status: OrderStatus;
}

export interface AssignDeliveryBoyRequest {
  deliveryBoyId: string;
}

// ==================== RESPONSE TYPES ====================
export interface OrdersPaginatedResponse {
  orders: ApiOrder[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
  };
}

export interface OrderDashboardStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  processingOrders: number;
  readyOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  recentRevenue?: number;
}

export interface StatusCounts {
  PENDING: number;
  PROCESSING: number;
  READY: number;
  DELIVERED: number;
  CANCELLED: number;
}

export interface RevenueAnalytics {
  totalRevenue: number;
  dailyRevenue?: Array<{
    date: string;
    revenue: number;
    orderCount: number;
  }>;
  weeklyRevenue?: Array<{
    week: string;
    revenue: number;
    orderCount: number;
  }>;
  monthlyRevenue?: Array<{
    month: string;
    revenue: number;
    orderCount: number;
  }>;
}

export interface OrderCountResponse {
  count: number;
}

export interface HasPendingOrdersResponse {
  hasPending: boolean;
}
