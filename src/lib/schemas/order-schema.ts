import { z } from 'zod';

export const orderItemSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  clothType: z.string().min(1, 'Cloth type is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  unitPrice: z.number().min(0.01, 'Unit price must be greater than 0'),
  addOns: z.array(z.string()).optional(),
});

export const orderSchema = z.object({
  userId: z.string().min(1, 'Customer is required'),
  productId: z.string().min(1, 'Product is required'),
  addressId: z.string().optional(),
  items: z.array(orderItemSchema).min(1, 'At least one item is required'),
  totalAmount: z.number().min(0.01, 'Total amount must be greater than 0'),
  specialInstructions: z.string().optional(),
});

export type OrderFormData = z.infer<typeof orderSchema>;
export type OrderItemFormData = z.infer<typeof orderItemSchema>;
