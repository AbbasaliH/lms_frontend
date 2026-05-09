// Billing & Invoice API Services

import { apiClient } from './client';
import type {
  Invoice,
  InvoiceFilters,
  CreateInvoiceRequest,
  CreateInvoiceFromOrderRequest,
  UpdateInvoiceRequest,
  UpdateInvoiceStatusRequest,
  RecordPaymentRequest,
  BillingDashboardStats,
  PrintInvoiceData,
  InvoicesPaginatedResponse,
  ApiResponse,
} from '@/lib/types/billing';

const BASE_URL = '/billing';

export const billingApi = {
  // ==================== DASHBOARD ====================
  getDashboard: async (): Promise<ApiResponse<BillingDashboardStats>> => {
    return apiClient.get(`${BASE_URL}/dashboard`);
  },

  // ==================== MY INVOICES ====================
  getMyInvoices: async (
    filters: InvoiceFilters = {}
  ): Promise<ApiResponse<InvoicesPaginatedResponse>> => {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    const queryString = queryParams.toString();
    return apiClient.get(
      `${BASE_URL}/my-invoices${queryString ? `?${queryString}` : ''}`
    );
  },

  // ==================== INVOICES ====================
  getInvoices: async (
    filters: InvoiceFilters = {}
  ): Promise<ApiResponse<InvoicesPaginatedResponse>> => {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    const queryString = queryParams.toString();
    return apiClient.get(
      `${BASE_URL}/invoices${queryString ? `?${queryString}` : ''}`
    );
  },

  getInvoiceById: async (id: string): Promise<ApiResponse<Invoice>> => {
    return apiClient.get(`${BASE_URL}/invoices/${id}`);
  },

  getInvoiceByNumber: async (
    invoiceNumber: string
  ): Promise<ApiResponse<Invoice>> => {
    return apiClient.get(`${BASE_URL}/invoices/number/${invoiceNumber}`);
  },

  createInvoice: async (
    data: CreateInvoiceRequest
  ): Promise<ApiResponse<Invoice>> => {
    return apiClient.post(`${BASE_URL}/invoices`, data);
  },

  createInvoiceFromOrder: async (
    data: CreateInvoiceFromOrderRequest
  ): Promise<ApiResponse<Invoice>> => {
    return apiClient.post(`${BASE_URL}/invoices/from-order`, data);
  },

  updateInvoice: async (
    id: string,
    data: UpdateInvoiceRequest
  ): Promise<ApiResponse<Invoice>> => {
    return apiClient.put(`${BASE_URL}/invoices/${id}`, data);
  },

  updateInvoiceStatus: async (
    id: string,
    data: UpdateInvoiceStatusRequest
  ): Promise<ApiResponse<Invoice>> => {
    return apiClient.patch(`${BASE_URL}/invoices/${id}/status`, data);
  },

  recordPayment: async (
    id: string,
    data: RecordPaymentRequest
  ): Promise<ApiResponse<Invoice>> => {
    return apiClient.patch(`${BASE_URL}/invoices/${id}/payment`, data);
  },

  deleteInvoice: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete(`${BASE_URL}/invoices/${id}`);
  },

  getPrintInvoiceData: async (
    id: string
  ): Promise<ApiResponse<PrintInvoiceData>> => {
    return apiClient.get(`${BASE_URL}/invoices/${id}/print`);
  },
};
