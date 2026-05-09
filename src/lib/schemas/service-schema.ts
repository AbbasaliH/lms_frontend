import { z } from 'zod';
import { ServiceCategory } from '../types/service';

export const serviceSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  category: z.nativeEnum(ServiceCategory, {
    message: 'Please select a service category',
  }),
  basePrice: z.number().min(0, 'Base price must be a positive number'),
  pricePerUnit: z.number().min(0).optional(),
  unitType: z.string().optional(),
  isActive: z.boolean(),
  durationHours: z.number().min(1).optional(),
  iconUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  taxRate: z.number().min(0),
});

export type ServiceFormData = z.infer<typeof serviceSchema>;
