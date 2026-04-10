// Supplier Management API Services

import { apiClient } from './client';
import type {
  Supplier,
  PurchaseOrder,
  SupplierPayment,
  SupplierRating,
  SupplierContract,
  SupplierDocument,
  SupplierInventoryLink,
  DashboardStats,
  SupplierPerformance,
  ApiResponse,
  PaginatedResponse,
  CreateSupplierRequest,
  CreatePurchaseOrderRequest,
  CreatePaymentRequest,
  CreateRatingRequest,
  CreateContractRequest,
  CreateDocumentRequest,
  CreateInventoryLinkRequest,
  SupplierFilters,
  PurchaseOrderFilters,
  PaymentFilters,
  SupplierStatus,
  VerificationStatus,
  SupplierTier,
  PurchaseOrderStatus,
  PaymentStatus,
  ContractStatus,
} from '@/lib/types/supplier';

const BASE_URL = '/suppliers';

export const suppliersApi = {
  // ==================== DASHBOARD & ANALYTICS ====================
  getDashboardStats: async (): Promise<ApiResponse<DashboardStats>> => {
    return apiClient.get(`${BASE_URL}/dashboard`);
  },

  getTopSuppliers: async (params?: {
    metric?: 'rating' | 'orders' | 'value';
    limit?: number;
  }): Promise<ApiResponse<Supplier[]>> => {
    const queryParams = new URLSearchParams();
    if (params?.metric) queryParams.append('metric', params.metric);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `${BASE_URL}/top-suppliers?${queryString}` : `${BASE_URL}/top-suppliers`;
    
    return apiClient.get(endpoint);
  },

  // ==================== SUPPLIER MANAGEMENT ====================
  getSuppliers: async (
    filters: SupplierFilters = {}
  ): Promise<PaginatedResponse<Supplier>> => {
    const queryParams = new URLSearchParams();
    
    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.limit) queryParams.append('limit', filters.limit.toString());
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.supplierType) queryParams.append('supplierType', filters.supplierType);
    if (filters.verificationStatus) queryParams.append('verificationStatus', filters.verificationStatus);
    if (filters.tier) queryParams.append('tier', filters.tier);
    if (filters.search) queryParams.append('search', filters.search);
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `${BASE_URL}?${queryString}` : BASE_URL;
    
    return apiClient.get(endpoint);
  },

  getSupplierById: async (id: string): Promise<ApiResponse<Supplier>> => {
    return apiClient.get(`${BASE_URL}/${id}`);
  },

  createSupplier: async (
    data: CreateSupplierRequest
  ): Promise<ApiResponse<Supplier>> => {
    return apiClient.post(`${BASE_URL}`, data);
  },

  updateSupplier: async (
    id: string,
    data: Partial<CreateSupplierRequest>
  ): Promise<ApiResponse<Supplier>> => {
    return apiClient.put(`${BASE_URL}/${id}`, data);
  },

  deleteSupplier: async (id: string): Promise<ApiResponse<Supplier>> => {
    return apiClient.delete(`${BASE_URL}/${id}`);
  },

  verifySupplier: async (
    id: string,
    data: { verificationStatus: VerificationStatus; notes?: string }
  ): Promise<ApiResponse<Supplier>> => {
    return apiClient.patch(`${BASE_URL}/${id}/verify`, data);
  },

  updateSupplierStatus: async (
    id: string,
    data: { status: SupplierStatus; reason?: string }
  ): Promise<ApiResponse<Supplier>> => {
    return apiClient.patch(`${BASE_URL}/${id}/status`, data);
  },

  updateSupplierTier: async (
    id: string,
    data: { tier: SupplierTier }
  ): Promise<ApiResponse<Supplier>> => {
    return apiClient.patch(`${BASE_URL}/${id}/tier`, data);
  },

  getSupplierPerformance: async (
    supplierId: string
  ): Promise<ApiResponse<SupplierPerformance>> => {
    return apiClient.get(`${BASE_URL}/${supplierId}/performance`);
  },

  // ==================== PURCHASE ORDER MANAGEMENT ====================
  getPurchaseOrders: async (
    filters: PurchaseOrderFilters = {}
  ): Promise<PaginatedResponse<PurchaseOrder>> => {
    const queryParams = new URLSearchParams();
    
    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.limit) queryParams.append('limit', filters.limit.toString());
    if (filters.supplierId) queryParams.append('supplierId', filters.supplierId);
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.paymentStatus) queryParams.append('paymentStatus', filters.paymentStatus);
    if (filters.fromDate) queryParams.append('fromDate', filters.fromDate);
    if (filters.toDate) queryParams.append('toDate', filters.toDate);
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `${BASE_URL}/purchase-orders/all?${queryString}` : `${BASE_URL}/purchase-orders/all`;
    
    return apiClient.get(endpoint);
  },

  getPurchaseOrderById: async (
    id: string
  ): Promise<ApiResponse<PurchaseOrder>> => {
    return apiClient.get(`${BASE_URL}/purchase-orders/${id}`);
  },

  createPurchaseOrder: async (
    data: CreatePurchaseOrderRequest
  ): Promise<ApiResponse<PurchaseOrder>> => {
    return apiClient.post(`${BASE_URL}/purchase-orders`, data);
  },

  updatePurchaseOrderStatus: async (
    id: string,
    data: {
      status: PurchaseOrderStatus;
      actualDelivery?: string;
      rejectedReason?: string;
      receivedBy?: string;
      qualityCheckDone?: boolean;
      qualityCheckBy?: string;
      qualityIssues?: string;
    }
  ): Promise<ApiResponse<PurchaseOrder>> => {
    return apiClient.patch(`${BASE_URL}/purchase-orders/${id}/status`, data);
  },

  approvePurchaseOrder: async (
    id: string
  ): Promise<ApiResponse<PurchaseOrder>> => {
    return apiClient.patch(`${BASE_URL}/purchase-orders/${id}/approve`);
  },

  // ==================== PAYMENT MANAGEMENT ====================
  getPayments: async (
    filters: PaymentFilters = {}
  ): Promise<PaginatedResponse<SupplierPayment>> => {
    const queryParams = new URLSearchParams();
    
    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.limit) queryParams.append('limit', filters.limit.toString());
    if (filters.supplierId) queryParams.append('supplierId', filters.supplierId);
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.fromDate) queryParams.append('fromDate', filters.fromDate);
    if (filters.toDate) queryParams.append('toDate', filters.toDate);
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `${BASE_URL}/payments/all?${queryString}` : `${BASE_URL}/payments/all`;
    
    return apiClient.get(endpoint);
  },

  recordPayment: async (
    data: CreatePaymentRequest
  ): Promise<ApiResponse<SupplierPayment>> => {
    return apiClient.post(`${BASE_URL}/payments`, data);
  },

  approvePayment: async (
    id: string
  ): Promise<ApiResponse<SupplierPayment>> => {
    return apiClient.patch(`${BASE_URL}/payments/${id}/approve`);
  },

  // ==================== RATING & REVIEW ====================
  addRating: async (
    data: CreateRatingRequest
  ): Promise<ApiResponse<SupplierRating>> => {
    return apiClient.post(`${BASE_URL}/ratings`, data);
  },

  getSupplierRatings: async (
    supplierId: string,
    params?: { page?: number; limit?: number }
  ): Promise<PaginatedResponse<SupplierRating>> => {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `${BASE_URL}/${supplierId}/ratings?${queryString}` : `${BASE_URL}/${supplierId}/ratings`;
    
    return apiClient.get(endpoint);
  },

  // ==================== CONTRACT MANAGEMENT ====================
  createContract: async (
    data: CreateContractRequest
  ): Promise<ApiResponse<SupplierContract>> => {
    return apiClient.post(`${BASE_URL}/contracts`, data);
  },

  updateContractStatus: async (
    id: string,
    data: { status: ContractStatus }
  ): Promise<ApiResponse<SupplierContract>> => {
    return apiClient.patch(`${BASE_URL}/contracts/${id}/status`, data);
  },

  getExpiringContracts: async (params?: {
    daysAhead?: number;
  }): Promise<ApiResponse<SupplierContract[]>> => {
    const queryParams = new URLSearchParams();
    
    if (params?.daysAhead) queryParams.append('daysAhead', params.daysAhead.toString());
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `${BASE_URL}/contracts/expiring?${queryString}` : `${BASE_URL}/contracts/expiring`;
    
    return apiClient.get(endpoint);
  },

  // ==================== DOCUMENT MANAGEMENT ====================
  uploadDocument: async (
    data: CreateDocumentRequest
  ): Promise<ApiResponse<SupplierDocument>> => {
    return apiClient.post(`${BASE_URL}/documents`, data);
  },

  verifyDocument: async (
    id: string,
    data: { isVerified: boolean; notes?: string }
  ): Promise<ApiResponse<SupplierDocument>> => {
    return apiClient.patch(`${BASE_URL}/documents/${id}/verify`, data);
  },

  getExpiringDocuments: async (params?: {
    daysAhead?: number;
  }): Promise<ApiResponse<SupplierDocument[]>> => {
    const queryParams = new URLSearchParams();
    
    if (params?.daysAhead) queryParams.append('daysAhead', params.daysAhead.toString());
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `${BASE_URL}/documents/expiring?${queryString}` : `${BASE_URL}/documents/expiring`;
    
    return apiClient.get(endpoint);
  },

  // ==================== INVENTORY INTEGRATION ====================
  linkInventory: async (
    data: CreateInventoryLinkRequest
  ): Promise<ApiResponse<SupplierInventoryLink>> => {
    return apiClient.post(`${BASE_URL}/inventory-links`, data);
  },

  getSuppliersForInventory: async (
    inventoryId: string
  ): Promise<ApiResponse<SupplierInventoryLink[]>> => {
    return apiClient.get(`${BASE_URL}/inventory/${inventoryId}/suppliers`);
  },
};