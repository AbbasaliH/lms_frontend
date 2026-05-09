// Inventory Hooks

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { inventoryApi } from '@/lib/api/inventory';

// ==================== STATS & ANALYTICS ====================
export const useInventoryStats = () => {
  return useQuery({
    queryKey: ['inventory-stats'],
    queryFn: () => inventoryApi.getInventoryStats(),
  });
};

export const useLowStock = () => {
  return useQuery({
    queryKey: ['inventory-low-stock'],
    queryFn: () => inventoryApi.getLowStock(),
  });
};

// ==================== SINGLE ITEM & TRANSACTIONS ====================
export const useInventoryItem = (id: string) => {
  return useQuery({
    queryKey: ['inventory-item', id],
    queryFn: () => inventoryApi.getInventoryById(id),
    enabled: !!id,
  });
};

export const useInventoryTransactions = (id: string) => {
  return useQuery({
    queryKey: ['inventory-transactions', id],
    queryFn: () => inventoryApi.getInventoryTransactions(id),
    enabled: !!id,
  });
};

export const useCreateInventoryTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => inventoryApi.createInventoryTransaction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['inventory-stats'] });
      queryClient.invalidateQueries({ queryKey: ['inventory-low-stock'] });
      toast.success('Transaction recorded successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to record transaction');
    },
  });
};

export const useBulkUpdateInventory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => inventoryApi.bulkUpdateInventory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['inventory-stats'] });
      queryClient.invalidateQueries({ queryKey: ['inventory-low-stock'] });
      toast.success('Bulk update successful');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to bulk update inventory');
    },
  });
};
