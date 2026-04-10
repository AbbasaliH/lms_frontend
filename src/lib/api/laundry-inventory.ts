// Advanced Laundry Inventory Management API Services

import { apiClient } from './client';
import type {
  InventoryItem,
  InventoryBatch,
  InventoryTransaction,
  InventoryLocation,
  InventoryAlert,
  StockTransfer,
  InventoryAnalytics,
  UsageTrend,
  StockReport,
  ApiResponse,
  PaginatedResponse,
  CreateInventoryItemRequest,
  UpdateInventoryItemRequest,
  RecordUsageRequest,
  RecordWastageRequest,
  AdjustStockRequest,
  CreateStockTransferRequest,
  ReceiveStockTransferRequest,
  CreateBatchRequest,
  InventoryFilters,
  TransactionFilters,
  AlertFilters,
  AnalyticsFilters,
} from '@/lib/types/laundry-inventory';

const BASE_URL = '/laundry/inventory';

export const laundryInventoryApi = {
  // ==================== INVENTORY ITEMS ====================
  getItems: async (filters: InventoryFilters = {}): Promise<ApiResponse<PaginatedResponse<InventoryItem>>> => {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    const queryString = queryParams.toString();
    return apiClient.get(`${BASE_URL}/items${queryString ? `?${queryString}` : ''}`);
  },

  getItemById: async (id: string): Promise<ApiResponse<InventoryItem>> => {
    return apiClient.get(`${BASE_URL}/items/${id}`);
  },

  getItemBySku: async (sku: string): Promise<ApiResponse<InventoryItem>> => {
    return apiClient.get(`${BASE_URL}/items/sku/${sku}`);
  },

  getItemByBarcode: async (barcode: string): Promise<ApiResponse<InventoryItem>> => {
    return apiClient.get(`${BASE_URL}/items/barcode/${barcode}`);
  },

  createItem: async (data: CreateInventoryItemRequest): Promise<ApiResponse<InventoryItem>> => {
    return apiClient.post(`${BASE_URL}/items`, data);
  },

  updateItem: async (id: string, data: UpdateInventoryItemRequest): Promise<ApiResponse<InventoryItem>> => {
    return apiClient.put(`${BASE_URL}/items/${id}`, data);
  },

  deleteItem: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete(`${BASE_URL}/items/${id}`);
  },

  // ==================== STOCK OPERATIONS ====================
  recordUsage: async (data: RecordUsageRequest): Promise<ApiResponse<InventoryTransaction>> => {
    return apiClient.post(`${BASE_URL}/usage`, data);
  },

  recordWastage: async (data: RecordWastageRequest): Promise<ApiResponse<InventoryTransaction>> => {
    return apiClient.post(`${BASE_URL}/wastage`, data);
  },

  adjustStock: async (data: AdjustStockRequest): Promise<ApiResponse<InventoryTransaction>> => {
    return apiClient.post(`${BASE_URL}/adjust`, data);
  },

  receiveStock: async (id: string, quantity: number, batchData?: Partial<CreateBatchRequest>): Promise<ApiResponse<InventoryItem>> => {
    return apiClient.post(`${BASE_URL}/items/${id}/receive`, { quantity, ...batchData });
  },

  // ==================== BATCHES ====================
  getBatches: async (inventoryItemId?: string): Promise<ApiResponse<InventoryBatch[]>> => {
    const url = inventoryItemId 
      ? `${BASE_URL}/batches?inventoryItemId=${inventoryItemId}` 
      : `${BASE_URL}/batches`;
    return apiClient.get(url);
  },

  getBatchById: async (id: string): Promise<ApiResponse<InventoryBatch>> => {
    return apiClient.get(`${BASE_URL}/batches/${id}`);
  },

  createBatch: async (data: CreateBatchRequest): Promise<ApiResponse<InventoryBatch>> => {
    return apiClient.post(`${BASE_URL}/batches`, data);
  },

  updateBatch: async (id: string, data: Partial<CreateBatchRequest>): Promise<ApiResponse<InventoryBatch>> => {
    return apiClient.put(`${BASE_URL}/batches/${id}`, data);
  },

  deleteBatch: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete(`${BASE_URL}/batches/${id}`);
  },

  // ==================== TRANSACTIONS ====================
  getTransactions: async (filters: TransactionFilters = {}): Promise<ApiResponse<PaginatedResponse<InventoryTransaction>>> => {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    const queryString = queryParams.toString();
    return apiClient.get(`${BASE_URL}/transactions${queryString ? `?${queryString}` : ''}`);
  },

  getTransactionById: async (id: string): Promise<ApiResponse<InventoryTransaction>> => {
    return apiClient.get(`${BASE_URL}/transactions/${id}`);
  },

  getItemTransactions: async (inventoryItemId: string, filters: TransactionFilters = {}): Promise<ApiResponse<PaginatedResponse<InventoryTransaction>>> => {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    const queryString = queryParams.toString();
    return apiClient.get(`${BASE_URL}/items/${inventoryItemId}/transactions${queryString ? `?${queryString}` : ''}`);
  },

  // ==================== LOCATIONS ====================
  getLocations: async (): Promise<ApiResponse<InventoryLocation[]>> => {
    return apiClient.get(`${BASE_URL}/locations`);
  },

  getLocationById: async (id: string): Promise<ApiResponse<InventoryLocation>> => {
    return apiClient.get(`${BASE_URL}/locations/${id}`);
  },

  createLocation: async (data: Omit<InventoryLocation, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<InventoryLocation>> => {
    return apiClient.post(`${BASE_URL}/locations`, data);
  },

  updateLocation: async (id: string, data: Partial<Omit<InventoryLocation, 'id' | 'createdAt' | 'updatedAt'>>): Promise<ApiResponse<InventoryLocation>> => {
    return apiClient.put(`${BASE_URL}/locations/${id}`, data);
  },

  deleteLocation: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete(`${BASE_URL}/locations/${id}`);
  },

  getLocationInventory: async (locationId: string, filters: InventoryFilters = {}): Promise<ApiResponse<PaginatedResponse<InventoryItem>>> => {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    const queryString = queryParams.toString();
    return apiClient.get(`${BASE_URL}/locations/${locationId}/items${queryString ? `?${queryString}` : ''}`);
  },

  // ==================== STOCK TRANSFERS ====================
  getStockTransfers: async (params?: { status?: string; locationId?: string }): Promise<ApiResponse<StockTransfer[]>> => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.locationId) queryParams.append('locationId', params.locationId);
    const queryString = queryParams.toString();
    return apiClient.get(`${BASE_URL}/transfers${queryString ? `?${queryString}` : ''}`);
  },

  getStockTransferById: async (id: string): Promise<ApiResponse<StockTransfer>> => {
    return apiClient.get(`${BASE_URL}/transfers/${id}`);
  },

  createStockTransfer: async (data: CreateStockTransferRequest): Promise<ApiResponse<StockTransfer>> => {
    return apiClient.post(`${BASE_URL}/transfers`, data);
  },

  approveStockTransfer: async (id: string): Promise<ApiResponse<StockTransfer>> => {
    return apiClient.patch(`${BASE_URL}/transfers/${id}/approve`);
  },

  receiveStockTransfer: async (id: string, data: ReceiveStockTransferRequest): Promise<ApiResponse<StockTransfer>> => {
    return apiClient.patch(`${BASE_URL}/transfers/${id}/receive`, data);
  },

  cancelStockTransfer: async (id: string, reason: string): Promise<ApiResponse<StockTransfer>> => {
    return apiClient.patch(`${BASE_URL}/transfers/${id}/cancel`, { reason });
  },

  // ==================== ALERTS ====================
  getAlerts: async (filters: AlertFilters = {}): Promise<ApiResponse<PaginatedResponse<InventoryAlert>>> => {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    const queryString = queryParams.toString();
    return apiClient.get(`${BASE_URL}/alerts${queryString ? `?${queryString}` : ''}`);
  },

  getAlertById: async (id: string): Promise<ApiResponse<InventoryAlert>> => {
    return apiClient.get(`${BASE_URL}/alerts/${id}`);
  },

  markAlertAsRead: async (id: string): Promise<ApiResponse<InventoryAlert>> => {
    return apiClient.patch(`${BASE_URL}/alerts/${id}/read`);
  },

  resolveAlert: async (id: string): Promise<ApiResponse<InventoryAlert>> => {
    return apiClient.patch(`${BASE_URL}/alerts/${id}/resolve`);
  },

  // ==================== ANALYTICS & REPORTS ====================
  getAnalytics: async (filters: AnalyticsFilters = {}): Promise<ApiResponse<InventoryAnalytics>> => {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    const queryString = queryParams.toString();
    return apiClient.get(`${BASE_URL}/analytics${queryString ? `?${queryString}` : ''}`);
  },

  getUsageTrends: async (filters: AnalyticsFilters = {}): Promise<ApiResponse<UsageTrend[]>> => {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    const queryString = queryParams.toString();
    return apiClient.get(`${BASE_URL}/analytics/usage-trends${queryString ? `?${queryString}` : ''}`);
  },

  getStockReport: async (filters: AnalyticsFilters = {}): Promise<ApiResponse<StockReport[]>> => {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    const queryString = queryParams.toString();
    return apiClient.get(`${BASE_URL}/reports/stock${queryString ? `?${queryString}` : ''}`);
  },

  getCategoryReport: async (category: string, filters: AnalyticsFilters = {}): Promise<ApiResponse<any>> => {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    const queryString = queryParams.toString();
    return apiClient.get(`${BASE_URL}/reports/category/${category}${queryString ? `?${queryString}` : ''}`);
  },

  getWastageReport: async (filters: AnalyticsFilters = {}): Promise<ApiResponse<any>> => {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    const queryString = queryParams.toString();
    return apiClient.get(`${BASE_URL}/reports/wastage${queryString ? `?${queryString}` : ''}`);
  },

  getValuationReport: async (filters: AnalyticsFilters = {}): Promise<ApiResponse<any>> => {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    const queryString = queryParams.toString();
    return apiClient.get(`${BASE_URL}/reports/valuation${queryString ? `?${queryString}` : ''}`);
  },

  // ==================== UTILITY FUNCTIONS ====================
  generateSku: async (category: string): Promise<ApiResponse<{ sku: string }>> => {
    return apiClient.post(`${BASE_URL}/utility/generate-sku`, { category });
  },

  bulkImport: async (data: CreateInventoryItemRequest[]): Promise<ApiResponse<{ success: number; failed: number; errors?: any[] }>> => {
    return apiClient.post(`${BASE_URL}/bulk-import`, { items: data });
  },

  exportData: async (filters: InventoryFilters = {}): Promise<Blob> => {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    const queryString = queryParams.toString();
    return apiClient.getBlob(`${BASE_URL}/export${queryString ? `?${queryString}` : ''}`);
  },

  getLowStockItems: async (): Promise<ApiResponse<InventoryItem[]>> => {
    return apiClient.get(`${BASE_URL}/low-stock`);
  },

  getExpiredItems: async (): Promise<ApiResponse<InventoryItem[]>> => {
    return apiClient.get(`${BASE_URL}/expired`);
  },

  getNearExpiryItems: async (days: number = 30): Promise<ApiResponse<InventoryItem[]>> => {
    return apiClient.get(`${BASE_URL}/near-expiry?days=${days}`);
  },

  getReorderSuggestions: async (): Promise<ApiResponse<InventoryItem[]>> => {
    return apiClient.get(`${BASE_URL}/reorder-suggestions`);
  },
};
