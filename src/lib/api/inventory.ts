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
};