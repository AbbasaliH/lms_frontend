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

export const addCustomerSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phoneNumber: z.string().min(10, 'Valid phone number is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  villageName: z.string().optional(),
  streetName: z.string().optional(),
  tier: z.nativeEnum(CustomerTier).default(CustomerTier.REGULAR),
  specialInstructions: z.string().optional(),
  acquisitionSource: z.string().optional(),
  creditLimit: z.number().min(0).default(0),
  creditAllowed: z.boolean().default(false),
  isBusinessCustomer: z.boolean().default(false),
  companyName: z.string().optional(),
  gstin: z.string().optional(),
  businessType: z.string().optional(),
  notes: z.string().optional(),
});

export type AddCustomerFormData = z.infer<typeof addCustomerSchema>;
