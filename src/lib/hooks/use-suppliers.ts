// Supplier Management Hooks

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { suppliersApi } from '@/lib/api/suppliers';
import type {
  SupplierFilters,
  PurchaseOrderFilters,
  PaymentFilters,
  CreateSupplierRequest,
  CreatePurchaseOrderRequest,
  CreatePaymentRequest,
  CreateRatingRequest,
  SupplierStatus,
  VerificationStatus,
  SupplierTier,
  PurchaseOrderStatus,
} from '@/lib/types/supplier';

// ==================== DASHBOARD ====================
export const useSupplierDashboard = () => {
  return useQuery({
    queryKey: ['supplier-dashboard'],
    queryFn: () => suppliersApi.getDashboardStats(),
  });
};

export const useTopSuppliers = (
  metric: 'rating' | 'orders' | 'value' = 'rating',
  limit = 10
) => {
  return useQuery({
    queryKey: ['top-suppliers', metric, limit],
    queryFn: () => suppliersApi.getTopSuppliers({ metric, limit }),
  });
};

// ==================== SUPPLIERS ====================
export const useSuppliers = (filters: SupplierFilters = {}) => {
  return useQuery({
    queryKey: ['suppliers', filters],
    queryFn: () => suppliersApi.getSuppliers(filters),
  });
};

export const useSupplier = (id: string) => {
  return useQuery({
    queryKey: ['supplier', id],
    queryFn: () => suppliersApi.getSupplierById(id),
    enabled: !!id,
  });
};

export const useCreateSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSupplierRequest) =>
      suppliersApi.createSupplier(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      queryClient.invalidateQueries({ queryKey: ['supplier-dashboard'] });
      toast.success(response.message || 'Supplier created successfully');
    },
    onError: (error: any) => {
      const errorMsg = error.response?.data?.error || error.message || 'Failed to create supplier';
      toast.error(errorMsg);
    },
  });
};

export const useUpdateSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateSupplierRequest>;
    }) => suppliersApi.updateSupplier(id, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ['supplier', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast.success(response.message || 'Supplier updated successfully');
    },
    onError: (error: any) => {
      const errorMsg = error.response?.data?.error || error.message || 'Failed to update supplier';
      toast.error(errorMsg);
    },
  });
};

export const useDeleteSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => suppliersApi.deleteSupplier(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      queryClient.invalidateQueries({ queryKey: ['supplier-dashboard'] });
      toast.success(response.message || 'Supplier deleted successfully');
    },
    onError: (error: any) => {
      const errorMsg = error.response?.data?.error || error.message || 'Failed to delete supplier';
      toast.error(errorMsg);
    },
  });
};

export const useVerifySupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      verificationStatus,
      notes,
    }: {
      id: string;
      verificationStatus: VerificationStatus;
      notes?: string;
    }) => suppliersApi.verifySupplier(id, { verificationStatus, notes }),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ['supplier', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast.success(response.message || 'Supplier verification updated');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to verify supplier');
    },
  });
};

export const useUpdateSupplierStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
      reason,
    }: {
      id: string;
      status: SupplierStatus;
      reason?: string;
    }) => suppliersApi.updateSupplierStatus(id, { status, reason }),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ['supplier', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast.success(response.message || 'Supplier status updated');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update status');
    },
  });
};

export const useUpdateSupplierTier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, tier }: { id: string; tier: SupplierTier }) =>
      suppliersApi.updateSupplierTier(id, { tier }),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ['supplier', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast.success(response.message || 'Supplier tier updated');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update tier');
    },
  });
};

export const useSupplierPerformance = (supplierId: string) => {
  return useQuery({
    queryKey: ['supplier-performance', supplierId],
    queryFn: () => suppliersApi.getSupplierPerformance(supplierId),
    enabled: !!supplierId,
  });
};

// ==================== PURCHASE ORDERS ====================
export const usePurchaseOrders = (filters: PurchaseOrderFilters = {}) => {
  return useQuery({
    queryKey: ['purchase-orders', filters],
    queryFn: () => suppliersApi.getPurchaseOrders(filters),
  });
};

export const usePurchaseOrder = (id: string) => {
  return useQuery({
    queryKey: ['purchase-order', id],
    queryFn: () => suppliersApi.getPurchaseOrderById(id),
    enabled: !!id,
  });
};

export const useCreatePurchaseOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePurchaseOrderRequest) =>
      suppliersApi.createPurchaseOrder(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
      queryClient.invalidateQueries({ queryKey: ['supplier-dashboard'] });
      toast.success(response.message || 'Purchase order created successfully');
    },
    onError: (error: any) => {
      const errorMsg = error.response?.data?.error || error.message || 'Failed to create purchase order';
      toast.error(errorMsg);
    },
  });
};

export const useUpdatePurchaseOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
      data,
    }: {
      id: string;
      status: PurchaseOrderStatus;
      data?: any;
    }) =>
      suppliersApi.updatePurchaseOrderStatus(id, {
        status,
        ...data,
      }),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['purchase-order', variables.id],
      });
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
      toast.success(response.message || 'Purchase order status updated');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update status');
    },
  });
};

export const useApprovePurchaseOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => suppliersApi.approvePurchaseOrder(id),
    onSuccess: (response, id) => {
      queryClient.invalidateQueries({ queryKey: ['purchase-order', id] });
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
      toast.success(response.message || 'Purchase order approved');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to approve order');
    },
  });
};

// ==================== PAYMENTS ====================
export const usePayments = (filters: PaymentFilters = {}) => {
  return useQuery({
    queryKey: ['payments', filters],
    queryFn: () => suppliersApi.getPayments(filters),
  });
};

export const useRecordPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePaymentRequest) =>
      suppliersApi.recordPayment(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['supplier-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
      toast.success(response.message || 'Payment recorded successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to record payment');
    },
  });
};

export const useApprovePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => suppliersApi.approvePayment(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      toast.success(response.message || 'Payment approved');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to approve payment');
    },
  });
};

// ==================== RATINGS ====================
export const useAddRating = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRatingRequest) => suppliersApi.addRating(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      queryClient.invalidateQueries({ queryKey: ['supplier-ratings'] });
      toast.success(response.message || 'Rating added successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to add rating');
    },
  });
};

export const useSupplierRatings = (
  supplierId: string,
  page = 1,
  limit = 10
) => {
  return useQuery({
    queryKey: ['supplier-ratings', supplierId, page, limit],
    queryFn: () => suppliersApi.getSupplierRatings(supplierId, { page, limit }),
    enabled: !!supplierId,
  });
};