// Payment API Services

import { apiClient } from './client';
import type {
  PaymentsResponse,
  PaymentResponse,
  PaymentStatsResponse,
  PaymentFilters,
  CreatePaymentRequest,
  RefundPaymentRequest,
  CreateWalletOrderRequest,
  CreateWalletOrderResponse,
  CreateOrderPaymentRequest,
  VerifyPaymentRequest,
  VerifyPaymentResponse,
} from '../types/payment';

export const paymentsApi = {
  getPayments: async (filters: PaymentFilters = {}): Promise<PaymentsResponse> => {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.status) params.append('status', filters.status);
    if (filters.paymentMethod) params.append('paymentMethod', filters.paymentMethod);
    if (filters.type) params.append('type', filters.type);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.minAmount) params.append('minAmount', filters.minAmount.toString());
    if (filters.maxAmount) params.append('maxAmount', filters.maxAmount.toString());

    const queryString = params.toString();
    const endpoint = queryString ? `/payments?${queryString}` : '/payments';
    
    return apiClient.get<PaymentsResponse>(endpoint);
  },

  getPaymentById: async (id: string): Promise<PaymentResponse> => {
    return apiClient.get<PaymentResponse>(`/payments/${id}`);
  },

  getPaymentStats: async (): Promise<PaymentStatsResponse> => {
    return apiClient.get<PaymentStatsResponse>('/payments/stats');
  },

  createPayment: async (data: CreatePaymentRequest): Promise<PaymentResponse> => {
    return apiClient.post<PaymentResponse>('/payments', data);
  },

  refundPayment: async (data: RefundPaymentRequest): Promise<PaymentResponse> => {
    return apiClient.post<PaymentResponse>(`/payments/${data.paymentId}/refund`, {
      amount: data.amount,
      reason: data.reason,
    });
  },

  downloadReceipt: async (paymentId: string): Promise<Blob> => {
    return apiClient.getBlob(`/payments/${paymentId}/receipt`);
  },

  // Razorpay Payment Methods
  createWalletOrder: async (data: CreateWalletOrderRequest): Promise<CreateWalletOrderResponse> => {
    return apiClient.post<CreateWalletOrderResponse>('/payment/wallet/create-order', data);
  },

  createOrderPayment: async (data: CreateOrderPaymentRequest): Promise<CreateWalletOrderResponse> => {
    return apiClient.post<CreateWalletOrderResponse>('/payment/order/create-order', data);
  },

  verifyPayment: async (data: VerifyPaymentRequest): Promise<VerifyPaymentResponse> => {
    return apiClient.post<VerifyPaymentResponse>('/payment/verify', data);
  },
};
