// Payment Hooks

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentsApi } from '../api/payments';
import type {
  PaymentFilters,
  CreatePaymentRequest,
  RefundPaymentRequest,
  CreateWalletOrderRequest,
  CreateOrderPaymentRequest,
  VerifyPaymentRequest,
} from '../types/payment';
import { toast } from 'sonner';

export function usePayments(filters: PaymentFilters = {}) {
  return useQuery({
    queryKey: ['payments', filters],
    queryFn: () => paymentsApi.getPayments(filters),
  });
}

export function usePayment(id: string) {
  return useQuery({
    queryKey: ['payment', id],
    queryFn: () => paymentsApi.getPaymentById(id),
    enabled: !!id,
  });
}

export function usePaymentStats() {
  return useQuery({
    queryKey: ['payment-stats'],
    queryFn: () => paymentsApi.getPaymentStats(),
  });
}

export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePaymentRequest) => paymentsApi.createPayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['payment-stats'] });
      toast.success('Payment created successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to create payment');
    },
  });
}

export function useRefundPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RefundPaymentRequest) => paymentsApi.refundPayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['payment-stats'] });
      toast.success('Payment refunded successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to refund payment');
    },
  });
}

// Razorpay Payment Hooks
export function useCreateWalletOrder() {
  return useMutation({
    mutationFn: (data: CreateWalletOrderRequest) => paymentsApi.createWalletOrder(data),
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to create wallet order');
    },
  });
}

export function useCreateOrderPayment() {
  return useMutation({
    mutationFn: (data: CreateOrderPaymentRequest) => paymentsApi.createOrderPayment(data),
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to create order payment');
    },
  });
}

export function useVerifyPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: VerifyPaymentRequest) => paymentsApi.verifyPayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['payment-stats'] });
      toast.success('Payment verified successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to verify payment');
    },
  });
}
