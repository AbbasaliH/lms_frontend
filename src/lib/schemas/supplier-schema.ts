import { z } from 'zod';
import { SupplierType } from '../types/supplier';

export const supplierSchema = z.object({
  // Company Information
  companyName: z.string().min(2, 'Company name must be at least 2 characters').max(200, 'Company name is too long'),
  contactPerson: z.string().min(2, 'Contact person name must be at least 2 characters').max(100, 'Name is too long'),
  
  // Contact Information
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{9,14}$/, 'Invalid phone number format'),
  alternatePhone: z.string().regex(/^\+?[1-9]\d{9,14}$/, 'Invalid phone number format').optional().or(z.literal('')),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  
  // Address Information
  address: z.string().min(5, 'Address must be at least 5 characters').max(500, 'Address is too long'),
  city: z.string().min(2, 'City is required').max(100, 'City name is too long'),
  state: z.string().min(2, 'State is required').max(100, 'State name is too long'),
  postalCode: z.string().regex(/^\d{6}$/, 'Postal code must be 6 digits'),
  country: z.string().min(2, 'Country is required').max(100, 'Country name is too long'),
  
  // Tax Information
  gstin: z.string()
    .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid GSTIN format')
    .optional()
    .or(z.literal('')),
  panNumber: z.string()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format (e.g., ABCDE1234F)')
    .optional()
    .or(z.literal('')),
  
  // Supplier Classification
  supplierType: z.nativeEnum(SupplierType, {
    message: 'Supplier type is required',
  }),
  categoriesSupplied: z.array(z.string()).min(1, 'At least one category is required'),
  
  // Financial Terms
  creditLimit: z.number().min(0, 'Credit limit must be positive').optional(),
  paymentTermsDays: z.number().min(0, 'Payment terms must be positive').max(365, 'Payment terms cannot exceed 365 days'),
  
  // Bank Information
  bankName: z.string().min(2, 'Bank name is required').max(100, 'Bank name is too long').optional().or(z.literal('')),
  bankAccountNumber: z.string()
    .regex(/^\d{9,18}$/, 'Account number must be 9-18 digits')
    .optional()
    .or(z.literal('')),
  bankIFSC: z.string()
    .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code format (e.g., HDFC0001234)')
    .optional()
    .or(z.literal('')),
  bankBranch: z.string().min(2, 'Branch name is required').max(200, 'Branch name is too long').optional().or(z.literal('')),
  accountHolderName: z.string().min(2, 'Account holder name is required').max(200, 'Name is too long').optional().or(z.literal('')),
  
  // Additional Information
  notes: z.string().max(1000, 'Notes are too long').optional().or(z.literal('')),
});

export type SupplierFormData = z.infer<typeof supplierSchema>;