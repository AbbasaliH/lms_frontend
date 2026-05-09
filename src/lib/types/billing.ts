// Billing & Invoice Types

// ==================== ENUMS ====================
export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  PAID = 'PAID',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export enum InvoicePaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
  UPI = 'UPI',
  BANK_TRANSFER = 'BANK_TRANSFER',
  NET_BANKING = 'NET_BANKING',
  WALLET = 'WALLET',
  CHEQUE = 'CHEQUE',
}

// ==================== INTERFACES ====================
export interface InvoiceItem {
  id: string;
  invoiceId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  discount?: number;
  taxRate?: number;
  taxAmount?: number;
  serviceId?: string;
  productId?: string;
  orderItemId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceUser {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  userId: string;
  user?: InvoiceUser;
  orderId?: string;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  subtotal: number;
  discountAmount?: number;
  taxAmount?: number;
  totalAmount: number;
  paidAmount?: number;
  balanceDue?: number;
  notes?: string;
  terms?: string;
  paymentMethod?: InvoicePaymentMethod;
  paidAt?: string;
  sentAt?: string;
  items: InvoiceItem[];
  createdBy?: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BillingDashboardStats {
  totalInvoices: number;
  totalRevenue: number;
  totalPaid: number;
  totalOutstanding: number;
  totalOverdue: number;
  invoicesThisMonth: number;
  revenueThisMonth: number;
  averageInvoiceAmount: number;
  statusDistribution: {
    status: InvoiceStatus;
    count: number;
    amount: number;
  }[];
  recentInvoices: Invoice[];
  monthlyTrend: {
    month: string;
    year: number;
    revenue: number;
    invoiceCount: number;
    paidAmount: number;
    outstandingAmount: number;
  }[];
}

export interface PrintInvoiceData {
  invoice: Invoice;
  companyDetails?: {
    name: string;
    address?: string;
    phone?: string;
    email?: string;
    gstNumber?: string;
    logoUrl?: string;
  };
  printDate: string;
}

// ==================== REQUEST/RESPONSE TYPES ====================
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface InvoicesPaginatedResponse {
  invoices: Invoice[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
  };
}

export interface CreateInvoiceItemRequest {
  description: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
  taxRate?: number;
  serviceId?: string;
  productId?: string;
  orderItemId?: string;
}

export interface CreateInvoiceRequest {
  userId: string;
  issueDate: string;
  dueDate: string;
  items: CreateInvoiceItemRequest[];
  subtotal?: number;
  discountAmount?: number;
  taxAmount?: number;
  totalAmount?: number;
  notes?: string;
  terms?: string;
}

export interface CreateInvoiceFromOrderRequest {
  orderId: string;
  issueDate?: string;
  dueDate?: string;
  notes?: string;
  terms?: string;
}

export interface UpdateInvoiceRequest {
  issueDate?: string;
  dueDate?: string;
  items?: CreateInvoiceItemRequest[];
  subtotal?: number;
  discountAmount?: number;
  taxAmount?: number;
  totalAmount?: number;
  notes?: string;
  terms?: string;
}

export interface UpdateInvoiceStatusRequest {
  status: InvoiceStatus;
  reason?: string;
}

export interface RecordPaymentRequest {
  amount: number;
  paymentMethod: InvoicePaymentMethod;
  paymentDate: string;
  transactionId?: string;
  notes?: string;
}

// ==================== FILTER TYPES ====================
export interface InvoiceFilters {
  page?: number;
  limit?: number;
  userId?: string;
  status?: InvoiceStatus;
  fromDate?: string;
  toDate?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
