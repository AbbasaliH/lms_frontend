// Advanced Laundry Inventory Management Hooks

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { laundryInventoryApi } from '@/lib/api/laundry-inventory';
import type {
  InventoryFilters,
  TransactionFilters,
  AlertFilters,
  AnalyticsFilters,
  CreateInventoryItemRequest,
  UpdateInventoryItemRequest,
  RecordUsageRequest,
  RecordWastageRequest,
  AdjustStockRequest,
  CreateStockTransferRequest,
  ReceiveStockTransferRequest,
  CreateBatchRequest,
} from '@/lib/types/laundry-inventory';

// ==================== INVENTORY ITEMS ====================
export const useInventoryItems = (filters: InventoryFilters = {}) => {
  return useQuery({
    queryKey: ['laundry-inventory-items', filters],
    queryFn: () => laundryInventoryApi.getItems(filters),
  });
};

export const useInventoryItem = (id: string) => {
  return useQuery({
    queryKey: ['laundry-inventory-item', id],
    queryFn: () => laundryInventoryApi.getItemById(id),
    enabled: !!id,
  });
};

export const useInventoryItemBySku = (sku: string) => {
  return useQuery({
    queryKey: ['laundry-inventory-item-sku', sku],
    queryFn: () => laundryInventoryApi.getItemBySku(sku),
    enabled: !!sku,
  });
};

export const useInventoryItemByBarcode = (barcode: string) => {
  return useQuery({
    queryKey: ['laundry-inventory-item-barcode', barcode],
    queryFn: () => laundryInventoryApi.getItemByBarcode(barcode),
    enabled: !!barcode,
  });
};

export const useCreateInventoryItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateInventoryItemRequest) => laundryInventoryApi.createItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['laundry-inventory-items'] });
      queryClient.invalidateQueries({ queryKey: ['laundry-inventory-analytics'] });
      toast.success('Inventory item created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create inventory item');
    },
  });
};

export const useUpdateInventoryItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateInventoryItemRequest }) => 
      laundryInventoryApi.updateItem(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['laundry-inventory-items'] });
      queryClient.invalidateQueries({ queryKey: ['laundry-inventory-item', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['laundry-inventory-analytics'] });
      toast.success('Inventory item updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update inventory item');
    },
  });
};

export const useDeleteInventoryItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => laundryInventoryApi.deleteItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['laundry-inventory-items'] });
      queryClient.invalidateQueries({ queryKey: ['laundry-inventory-analytics'] });
      toast.success('Inventory item deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete inventory item');
    },
  });
};

// ==================== STOCK OPERATIONS ====================
export const useRecordUsage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: RecordUsageRequest) => laundryInventoryApi.recordUsage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['laundry-inventory-items'] });
      queryClient.invalidateQueries({ queryKey: ['laundry-inventory-transactions'] });
      queryClient.invalidateQueries({ queryKey: ['laundry-inventory-analytics'] });
      toast.success('Usage recorded successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to record usage');
    },
  });
};

export const useRecordWastage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: RecordWastageRequest) => laundryInventoryApi.recordWastage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['laundry-inventory-items'] });
      queryClient.invalidateQueries({ queryKey: ['laundry-inventory-transactions'] });
      queryClient.invalidateQueries({ queryKey: ['laundry-inventory-analytics'] });
      toast.success('Wastage recorded successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to record wastage');
    },
  });
};

export const useAdjustStock = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: AdjustStockRequest) => laundryInventoryApi.adjustStock(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['laundry-inventory-items'] });
      queryClient.invalidateQueries({ queryKey: ['laundry-inventory-transactions'] });
      queryClient.invalidateQueries({ queryKey: ['laundry-inventory-analytics'] });
      toast.success('Stock adjusted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to adjust stock');
    },
  });
};

export const useReceiveStock = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, quantity, batchData }: { id: string; quantity: number; batchData?: Partial<CreateBatchRequest> }) => 
      laundryInventoryApi.receiveStock(id, quantity, batchData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['laundry-inventory-items'] });
      queryClient.invalidateQueries({ queryKey: ['laundry-inventory-batches'] });
      queryClient.invalidateQueries({ queryKey: ['laundry-inventory-transactions'] });
      queryClient.invalidateQueries({ queryKey: ['laundry-inventory-analytics'] });
      toast.success('Stock received successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to receive stock');
    },
  });
};

// ==================== BATCHES ====================
export const useInventoryBatches = (inventoryItemId?: string) => {
  return useQuery({
    queryKey: ['laundry-inventory-batches', inventoryItemId],
    queryFn: () => laundryInventoryApi.getBatches(inventoryItemId),
  });
};

export const useInventoryBatch = (id: string) => {
  return useQuery({
    queryKey: ['laundry-inventory-batch', id],
    queryFn: () => laundryInventoryApi.getBatchById(id),
    enabled: !!id,
  });
};

export const useCreateBatch = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateBatchRequest) => laundryInventoryApi.createBatch(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['laundry-inventory-batches'] });
      queryClient.invalidateQueries({ queryKey: ['laundry-inventory-items'] });
      toast.success('Batch created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create batch');
    },
  });
};

export const useUpdateBatch = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateBatchRequest> }) => 
      laundryInventoryApi.updateBatch(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['laundry-inventory-batches'] });
      queryClient.invalidateQueries({ queryKey: ['laundry-inventory-batch', variables.id] });
      toast.success('Batch updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update batch');
    },
  });
};

export const useDeleteBatch = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => laundryInventoryApi.deleteBatch(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['laundry-inventory-batches'] });
      toast.success('Batch deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete batch');
    },
  });
};

// ==================== TRANSACTIONS ====================
export const useInventoryTransactions = (filters: TransactionFilters = {}) => {
  return useQuery({
    queryKey: ['laundry-inventory-transactions', filters],
    queryFn: () => laundryInventoryApi.getTransactions(filters),
  });
};

export const useInventoryTransaction = (id: string) => {
  return useQuery({
    queryKey: ['laundry-inventory-transaction', id],
    queryFn: () => laundryInventoryApi.getTransactionById(id),
    enabled: !!id,
  });
};

export const useItemTransactions = (inventoryItemId: string, filters: TransactionFilters = {}) => {
  return useQuery({
    queryKey: ['laundry-inventory-item-transactions', inventoryItemId, filters],
    queryFn: () => laundryInventoryApi.getItemTransactions(inventoryItemId, filters),
    enabled: !!inventoryItemId,
  });
};

// ==================== LOCATIONS ====================
export const useInventoryLocations = () => {
  return useQuery({
    queryKey: ['laundry-inventory-locations'],
    queryFn: () => laundryInventoryApi.getLocations(),
  });
};

export const useInventoryLocation = (id: string) => {
  return useQuery({
    queryKey: ['laundry-inventory-location', id],
    queryFn: () => laundryInventoryApi.getLocationById(id),
    enabled: !!id,
  });
};

export const useLocationInventory = (locationId: string, filters: InventoryFilters = {}) => {
  return useQuery({
    queryKey: ['laundry-inventory-location-items', locationId, filters],
    queryFn: () => laundryInventoryApi.getLocationInventory(locationId, filters),
    enabled: !!locationId,
  });
};

export const useCreateLocation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => laundryInventoryApi.createLocation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['laundry-inventory-locations'] });
      toast.success('Location created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create location');
    },
  });
};

export const useUpdateLocation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      laundryInventoryApi.updateLocation(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['laundry-inventory-locations'] });
      queryClient.invalidateQueries({ queryKey: ['laundry-inventory-location', variables.id] });
      toast.success('Location updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update location');
    },
  });
};

export const useDeleteLocation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => laundryInventoryApi.deleteLocation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['laundry-inventory-locations'] });
      toast.success('Location deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete location');
    },
  });
};

// ==================== STOCK TRANSFERS ====================
export const useStockTransfers = (params?: { status?: string; locationId?: string }) => {
  return useQuery({
    queryKey: ['laundry-stock-transfers', params],
    queryFn: () => laundryInventoryApi.getStockTransfers(params),
  });
};

export const useStockTransfer = (id: string) => {
  return useQuery({
    queryKey: ['laundry-stock-transfer', id],
    queryFn: () => laundryInventoryApi.getStockTransferById(id),
    enabled: !!id,
  });
};

export const useCreateStockTransfer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateStockTransferRequest) => laundryInventoryApi.createStockTransfer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['laundry-stock-transfers'] });
      toast.success('Stock transfer created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create stock transfer');
    },
  });
};

export const useApproveStockTransfer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => laundryInventoryApi.approveStockTransfer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['laundry-stock-transfers'] });
      toast.success('Stock transfer approved');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to approve stock transfer');
    },
  });
};

export const useReceiveStockTransfer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ReceiveStockTransferRequest }) => 
      laundryInventoryApi.receiveStockTransfer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['laundry-stock-transfers'] });
      queryClient.invalidateQueries({ queryKey: ['laundry-inventory-items'] });
      toast.success('Stock transfer received');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to receive stock transfer');
    },
  });
};

export const useCancelStockTransfer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => 
      laundryInventoryApi.cancelStockTransfer(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['laundry-stock-transfers'] });
      toast.success('Stock transfer cancelled');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to cancel stock transfer');
    },
  });
};

// ==================== ALERTS ====================
export const useInventoryAlerts = (filters: AlertFilters = {}) => {
  return useQuery({
    queryKey: ['laundry-inventory-alerts', filters],
    queryFn: () => laundryInventoryApi.getAlerts(filters),
  });
};

export const useMarkAlertAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => laundryInventoryApi.markAlertAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['laundry-inventory-alerts'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to mark alert as read');
    },
  });
};

export const useResolveAlert = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => laundryInventoryApi.resolveAlert(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['laundry-inventory-alerts'] });
      toast.success('Alert resolved');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to resolve alert');
    },
  });
};

// ==================== ANALYTICS & REPORTS ====================
export const useInventoryAnalytics = (filters: AnalyticsFilters = {}) => {
  return useQuery({
    queryKey: ['laundry-inventory-analytics', filters],
    queryFn: () => laundryInventoryApi.getAnalytics(filters),
  });
};

export const useUsageTrends = (filters: AnalyticsFilters = {}) => {
  return useQuery({
    queryKey: ['laundry-inventory-usage-trends', filters],
    queryFn: () => laundryInventoryApi.getUsageTrends(filters),
  });
};

export const useStockReport = (filters: AnalyticsFilters = {}) => {
  return useQuery({
    queryKey: ['laundry-inventory-stock-report', filters],
    queryFn: () => laundryInventoryApi.getStockReport(filters),
  });
};

export const useCategoryReport = (category: string, filters: AnalyticsFilters = {}) => {
  return useQuery({
    queryKey: ['laundry-inventory-category-report', category, filters],
    queryFn: () => laundryInventoryApi.getCategoryReport(category, filters),
    enabled: !!category,
  });
};

export const useWastageReport = (filters: AnalyticsFilters = {}) => {
  return useQuery({
    queryKey: ['laundry-inventory-wastage-report', filters],
    queryFn: () => laundryInventoryApi.getWastageReport(filters),
  });
};

export const useValuationReport = (filters: AnalyticsFilters = {}) => {
  return useQuery({
    queryKey: ['laundry-inventory-valuation-report', filters],
    queryFn: () => laundryInventoryApi.getValuationReport(filters),
  });
};

// ==================== UTILITY HOOKS ====================
export const useLowStockItems = () => {
  return useQuery({
    queryKey: ['laundry-inventory-low-stock'],
    queryFn: () => laundryInventoryApi.getLowStockItems(),
  });
};

export const useExpiredItems = () => {
  return useQuery({
    queryKey: ['laundry-inventory-expired'],
    queryFn: () => laundryInventoryApi.getExpiredItems(),
  });
};

export const useNearExpiryItems = (days: number = 30) => {
  return useQuery({
    queryKey: ['laundry-inventory-near-expiry', days],
    queryFn: () => laundryInventoryApi.getNearExpiryItems(days),
  });
};

export const useReorderSuggestions = () => {
  return useQuery({
    queryKey: ['laundry-inventory-reorder-suggestions'],
    queryFn: () => laundryInventoryApi.getReorderSuggestions(),
  });
};

export const useGenerateSku = () => {
  return useMutation({
    mutationFn: (category: string) => laundryInventoryApi.generateSku(category),
  });
};

export const useBulkImport = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateInventoryItemRequest[]) => laundryInventoryApi.bulkImport(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['laundry-inventory-items'] });
      queryClient.invalidateQueries({ queryKey: ['laundry-inventory-analytics'] });
      toast.success(`Successfully imported ${response.data.success} items`);
      if (response.data.failed > 0) {
        toast.error(`Failed to import ${response.data.failed} items`);
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to import items');
    },
  });
};
