import { z } from 'zod';

export const addInventorySchema = z.object({
  itemName: z.string().min(2, 'Item name must be at least 2 characters').max(100, 'Item name is too long'),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  quantity: z.number().min(0, 'Quantity must be 0 or greater'),
  unit: z.string().min(1, 'Unit is required'),
  minimumStock: z.number().min(0, 'Minimum stock must be 0 or greater'),
  reorderLevel: z.number().min(0, 'Reorder level must be 0 or greater'),
  costPerUnit: z.number().min(0.01, 'Cost per unit must be greater than 0'),
  supplierName: z.string().min(2, 'Supplier name must be at least 2 characters'),
  supplierContact: z.string().min(10, 'Supplier contact must be at least 10 digits'),
  location: z.string().optional(),
  notes: z.string().optional(),
});

export type AddInventoryFormData = z.infer<typeof addInventorySchema>;

// Legacy schema for backward compatibility
export const inventoryItemSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  category: z.string().min(1, 'Category is required'),
  quantity: z.number().min(0, 'Quantity must be 0 or greater'),
  unit: z.string().min(1, 'Unit is required'),
  minQuantity: z.number().min(0, 'Minimum quantity must be 0 or greater'),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  supplier: z.string().min(2, 'Supplier name must be at least 2 characters'),
});

export type InventoryItemFormData = z.infer<typeof inventoryItemSchema>;