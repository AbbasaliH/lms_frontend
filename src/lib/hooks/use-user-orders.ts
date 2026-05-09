// Base Orders Hooks (for /orders/* endpoints)

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { userOrdersApi } from '@/lib/api/user-orders';
import type {
  OrderFilters,
  CreateOrderRequest,
  UpdateOrderRequest,
  OrderStatusUpdateRequest,
  AssignDeliveryBoyRequest,
} from '@/lib/types/order';

// ==================== DASHBOARD & ANALYTICS ====================
export const useOrderDashboard = () => {
  return useQuery({
    queryKey: ['order-dashboard'],
    queryFn: () => userOrdersApi.getDashboard(),
  });
};

export const useStatusCounts = () => {
  return useQuery({
    queryKey: ['order-status-counts'],
    queryFn: () => userOrdersApi.getStatusCounts(),
  });
};

export const useRecentOrders = (limit: number = 10) => {
  return useQuery({
    queryKey: ['recent-orders', limit],
    queryFn: () => userOrdersApi.getRecentOrders(limit),
  });
};

export const useRevenueAnalytics = (dateRange?: { fromDate?: string; toDate?: string }) => {
  return useQuery({
    queryKey: ['revenue-analytics', dateRange],
    queryFn: () => userOrdersApi.getRevenueAnalytics(dateRange),
  });
};

// ==================== ORDERS CRUD ====================
export const useUserOrders = (filters: OrderFilters = {}) => {
  return useQuery({
    queryKey: ['user-orders', filters],
    queryFn: () => userOrdersApi.getOrders(filters),
  });
};

export const useOrder = (id: string) => {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => userOrdersApi.getOrderById(id),
    enabled: !!id,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderRequest) => userOrdersApi.createOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-orders'] });
      queryClient.invalidateQueries({ queryKey: ['order-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['order-status-counts'] });
      queryClient.invalidateQueries({ queryKey: ['recent-orders'] });
      queryClient.invalidateQueries({ queryKey: ['revenue-analytics'] });
      toast.success('Order created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create order');
    },
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrderRequest }) =>
      userOrdersApi.updateOrder(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user-orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['order-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['order-status-counts'] });
      queryClient.invalidateQueries({ queryKey: ['recent-orders'] });
      toast.success('Order updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update order');
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: OrderStatusUpdateRequest }) =>
      userOrdersApi.updateOrderStatus(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user-orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['order-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['order-status-counts'] });
      queryClient.invalidateQueries({ queryKey: ['recent-orders'] });
      toast.success('Order status updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update order status');
    },
  });
};

export const useAssignDeliveryBoyToOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AssignDeliveryBoyRequest }) =>
      userOrdersApi.assignDeliveryBoy(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user-orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['order-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['recent-orders'] });
      toast.success('Delivery boy assigned successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to assign delivery boy');
    },
  });
};

export const useCancelUserOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userOrdersApi.cancelOrder(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['user-orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', id] });
      queryClient.invalidateQueries({ queryKey: ['order-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['order-status-counts'] });
      queryClient.invalidateQueries({ queryKey: ['recent-orders'] });
      queryClient.invalidateQueries({ queryKey: ['revenue-analytics'] });
      toast.success('Order cancelled successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to cancel order');
    },
  });
};

// ==================== USER ORDERS ====================
export const useUserOrdersByUserId = (userId: string) => {
  return useQuery({
    queryKey: ['user-orders-by-user', userId],
    queryFn: () => userOrdersApi.getOrdersByUserId(userId),
    enabled: !!userId,
  });
};

export const useOrderCountByUser = (userId: string) => {
  return useQuery({
    queryKey: ['order-count-by-user', userId],
    queryFn: () => userOrdersApi.getOrderCountByUser(userId),
    enabled: !!userId,
  });
};

export const useHasPendingOrders = (userId: string) => {
  return useQuery({
    queryKey: ['has-pending-orders', userId],
    queryFn: () => userOrdersApi.hasPendingOrders(userId),
    enabled: !!userId,
  });
};

// ==================== DELIVERY BOY ORDERS ====================
export const useOrdersByDeliveryBoy = (deliveryBoyId: string) => {
  return useQuery({
    queryKey: ['orders-by-delivery-boy', deliveryBoyId],
    queryFn: () => userOrdersApi.getOrdersByDeliveryBoy(deliveryBoyId),
    enabled: !!deliveryBoyId,
  });
};
