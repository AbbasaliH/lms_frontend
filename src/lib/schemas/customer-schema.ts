import { z } from 'zod';
import { CustomerTier, CustomerStatus } from '../types/customer';

export const customerSchema = z.object({
  customerCode: z.string().min(1, 'Customer code required'),
  tier: z.nativeEnum(CustomerTier),
  status: z.nativeEnum(CustomerStatus),
  tags: z.array(z.string()).optional(),
  totalOrders: z.number().min(0),
  totalSpent: z.number().min(0),
  averageOrderValue: z.number().min(0),
  loyaltyPoints: z.number().min(0),
  lifetimePoints: z.number().min(0),
  creditLimit: z.number().min(0),
  creditAllowed: z.boolean(),
  isVerified: z.boolean(),
  isBusinessCustomer: z.boolean(),
  isBlacklisted: z.boolean(),
  joiningDate: z.date(),
});

export const createCustomerSchema = customerSchema.partial().extend({
  userId: z.string(),
});

export const updateCustomerSchema = customerSchema.partial();

export type CustomerFormData = z.infer<typeof customerSchema>;
export type CreateCustomerFormData = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerFormData = z.infer<typeof updateCustomerSchema>;

