// Billing & Invoice Hooks

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { billingApi } from '@/lib/api/billing';
import type {
  InvoiceFilters,
  CreateInvoiceRequest,
  CreateInvoiceFromOrderRequest,
  UpdateInvoiceRequest,
  UpdateInvoiceStatusRequest,
  RecordPaymentRequest,
} from '@/lib/types/billing';

// ==================== DASHBOARD ====================
export const useBillingDashboard = () => {
  return useQuery({
    queryKey: ['billing-dashboard'],
    queryFn: () => billingApi.getDashboard(),
  });
};

// ==================== MY INVOICES ====================
export const useMyInvoices = (filters: InvoiceFilters = {}) => {
  return useQuery({
    queryKey: ['my-invoices', filters],
    queryFn: () => billingApi.getMyInvoices(filters),
  });
};

// ==================== INVOICES ====================
export const useInvoices = (filters: InvoiceFilters = {}) => {
  return useQuery({
    queryKey: ['invoices', filters],
    queryFn: () => billingApi.getInvoices(filters),
  });
};

export const useInvoice = (id: string) => {
  return useQuery({
    queryKey: ['invoice', id],
    queryFn: () => billingApi.getInvoiceById(id),
    enabled: !!id,
  });
};

export const useInvoiceByNumber = (invoiceNumber: string) => {
  return useQuery({
    queryKey: ['invoice', 'number', invoiceNumber],
    queryFn: () => billingApi.getInvoiceByNumber(invoiceNumber),
    enabled: !!invoiceNumber,
  });
};

export const useCreateInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateInvoiceRequest) => billingApi.createInvoice(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['billing-dashboard'] });
      toast.success(response.message || 'Invoice created successfully');
    },
    onError: (error: any) => {
      const errorMsg =
        error.response?.data?.error || error.message || 'Failed to create invoice';
      toast.error(errorMsg);
    },
  });
};

export const useCreateInvoiceFromOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateInvoiceFromOrderRequest) =>
      billingApi.createInvoiceFromOrder(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['billing-dashboard'] });
      toast.success(response.message || 'Invoice created from order successfully');
    },
    onError: (error: any) => {
      const errorMsg =
        error.response?.data?.error || error.message || 'Failed to create invoice from order';
      toast.error(errorMsg);
    },
  });
};

export const useUpdateInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateInvoiceRequest;
    }) => billingApi.updateInvoice(id, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ['invoice', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['billing-dashboard'] });
      toast.success(response.message || 'Invoice updated successfully');
    },
    onError: (error: any) => {
      const errorMsg =
        error.response?.data?.error || error.message || 'Failed to update invoice';
      toast.error(errorMsg);
    },
  });
};

export const useUpdateInvoiceStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateInvoiceStatusRequest;
    }) => billingApi.updateInvoiceStatus(id, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ['invoice', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['my-invoices'] });
      queryClient.invalidateQueries({ queryKey: ['billing-dashboard'] });
      toast.success(response.message || 'Invoice status updated');
    },
    onError: (error: any) => {
      const errorMsg =
        error.response?.data?.error || error.message || 'Failed to update invoice status';
      toast.error(errorMsg);
    },
  });
};

export const useRecordInvoicePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: RecordPaymentRequest;
    }) => billingApi.recordPayment(id, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ['invoice', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['my-invoices'] });
      queryClient.invalidateQueries({ queryKey: ['billing-dashboard'] });
      toast.success(response.message || 'Payment recorded successfully');
    },
    onError: (error: any) => {
      const errorMsg =
        error.response?.data?.error || error.message || 'Failed to record payment';
      toast.error(errorMsg);
    },
  });
};

export const useDeleteInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => billingApi.deleteInvoice(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['my-invoices'] });
      queryClient.invalidateQueries({ queryKey: ['billing-dashboard'] });
      toast.success(response.message || 'Invoice deleted successfully');
    },
    onError: (error: any) => {
      const errorMsg =
        error.response?.data?.error || error.message || 'Failed to delete invoice';
      toast.error(errorMsg);
    },
  });
};

// ==================== PRINT / DOWNLOAD ====================
export const usePrintInvoiceData = (id: string) => {
  return useQuery({
    queryKey: ['invoice-print', id],
    queryFn: () => billingApi.getPrintInvoiceData(id),
    enabled: !!id,
  });
};
