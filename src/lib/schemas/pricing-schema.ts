import { z } from 'zod';

export const pricingItemSchema = z.object({
  serviceType: z.string().min(2, 'Service type must be at least 2 characters'),
  category: z.enum(['Basic', 'Premium', 'Express'], {
    message: 'Category is required',
  }),
  basePrice: z.number().min(0.01, 'Price must be greater than 0'),
  minQuantity: z.number().min(0, 'Minimum quantity must be 0 or greater').optional(),
  seasonalPrice: z.number().min(0, 'Seasonal price must be 0 or greater').optional(),
  description: z.string().max(500, 'Description is too long').optional(),
  unit: z.enum(['per_item', 'per_kg', 'per_load'], {
    message: 'Unit is required',
  }),
});

export type PricingItemFormData = z.infer<typeof pricingItemSchema>;