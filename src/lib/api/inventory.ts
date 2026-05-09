// Inventory API Services

import { apiClient } from './client';
import type {
  InventoryResponse,
  AddInventoryRequest,
  AddInventoryResponse,
} from '../types/inventory';

export const inventoryApi = {
  getInventory: async (page = 1, limit = 20): Promise<InventoryResponse> => {
    return apiClient.get<InventoryResponse>(`/inventory?page=${page}&limit=${limit}`);
  },

  addInventory: async (data: AddInventoryRequest): Promise<AddInventoryResponse> => {
    return apiClient.post<AddInventoryResponse>('/inventory', data);
  },

  updateInventory: async (id: string, data: Partial<AddInventoryRequest>): Promise<AddInventoryResponse> => {
    return apiClient.put<AddInventoryResponse>(`/inventory/${id}`, data);
  },

  deleteInventory: async (id: string): Promise<{ success: boolean; message: string }> => {
    return apiClient.delete(`/inventory/${id}`);
  },

  // ==================== STATS & ANALYTICS ====================
  getInventoryStats: async (): Promise<any> => {
    return apiClient.get('/inventory/stats');
  },

  getLowStock: async (): Promise<any> => {
    return apiClient.get('/inventory/low-stock');
  },

  // ==================== SINGLE ITEM & TRANSACTIONS ====================
  getInventoryById: async (id: string): Promise<any> => {
    return apiClient.get(`/inventory/${id}`);
  },

  createInventoryTransaction: async (data: any): Promise<any> => {
    return apiClient.post('/inventory/transactions', data);
  },

  getInventoryTransactions: async (id: string): Promise<any> => {
    return apiClient.get(`/inventory/${id}/transactions`);
  },

  bulkUpdateInventory: async (data: any): Promise<any> => {
    return apiClient.post('/inventory/bulk-update', data);
  },
};
