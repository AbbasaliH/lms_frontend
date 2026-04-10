// Payment Types and Enums

export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
  UPI = 'UPI',
  WALLET = 'WALLET',
  NET_BANKING = 'NET_BANKING',
  CREDIT = 'CREDIT',
}

export enum PaymentType {
  ORDER = 'ORDER',
  SUBSCRIPTION = 'SUBSCRIPTION',
  REFUND = 'REFUND',
  WALLET_TOPUP = 'WALLET_TOPUP',
}

// API Response Structure
export interface ApiPaymentUser {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
}

export interface ApiPaymentOrder {
  id: string;
  status: string;
  totalAmount: number;
}

export interface ApiPayment {
  id: string;
  orderId: string | null;
  userId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  type: PaymentType;
  transactionId: string | null;
  gatewayResponse: Record<string, any> | null;
  refundAmount: number;
  refundReason: string | null;
  refundedAt: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
  user: ApiPaymentUser;
  order?: ApiPaymentOrder;
}

export interface PaymentsResponse {
  success: boolean;
  data: {
    payments: ApiPayment[];
    pagination: PaymentsPagination;
  };
}

export interface PaymentsPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaymentFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: PaymentStatus;
  paymentMethod?: PaymentMethod;
  type?: PaymentType;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface CreatePaymentRequest {
  orderId?: string;
  userId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  type: PaymentType;
  transactionId?: string;
}

export interface RefundPaymentRequest {
  paymentId: string;
  amount: number;
  reason: string;
}

export interface PaymentStatsData {
  totalRevenue: number;
  totalTransactions: number;
  pendingPayments: number;
  failedPayments: number;
  refundedAmount: number;
  todayRevenue: number;
  monthRevenue: number;
  averageTransactionValue: number;
  paymentMethodBreakdown: {
    method: PaymentMethod;
    count: number;
    amount: number;
  }[];
}

export interface PaymentStatsResponse {
  success: boolean;
  data: PaymentStatsData;
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  data: ApiPayment;
}
