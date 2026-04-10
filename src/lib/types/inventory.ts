// Inventory API Types

export type InventoryStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'REORDER';

export interface ApiInventoryItem {
  id: string;
  itemName: string;
  description: string | null;
  category: string;
  quantity: number;
  unit: string;
  minimumStock: number;
  reorderLevel: number;
  costPerUnit: number;
  supplierName: string;
  supplierContact: string;
  lastRestockedAt: string | null;
  lastRestockedBy: string | null;
  status: InventoryStatus;
  location: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  updatedBy: string | null;
}

export interface InventoryPagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface InventoryResponse {
  success: boolean;
  data: {
    items: ApiInventoryItem[];
    pagination: InventoryPagination;
  };
}

export interface AddInventoryRequest {
  itemName: string;
  description?: string;
  category: string;
  quantity: number;
  unit: string;
  minimumStock: number;
  reorderLevel: number;
  costPerUnit: number;
  supplierName: string;
  supplierContact: string;
  location?: string;
  notes?: string;
}

export interface AddInventoryResponse {
  success: boolean;
  message: string;
  data: ApiInventoryItem;
}