import { z } from 'zod';
import { VehicleType } from '../types/delivery-boy';

export const deliveryBoySchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{9,14}$/, 'Invalid phone number format (include country code)'),
  password: z.string().min(8, 'Password must be at least 8 characters').optional(),
  gender: z.enum(['Male', 'Female', 'Other'], {
    message: 'Gender is required',
  }),
  villageName: z.string().min(2, 'Village name is required').optional(),
  streetName: z.string().min(2, 'Street name is required').optional(),
  vehicleType: z.nativeEnum(VehicleType, {
    message: 'Vehicle type is required',
  }),
  vehicleNumber: z.string().min(3, 'Vehicle number is required').optional().or(z.literal('')),
  licenseNumber: z.string().min(5, 'License number must be at least 5 characters').optional().or(z.literal('')),
  aadharNumber: z.string().regex(/^\d{12}$/, 'Aadhar number must be 12 digits').optional().or(z.literal('')),
  emergencyContact: z.string().regex(/^\+?[1-9]\d{9,14}$/, 'Invalid phone number format').optional().or(z.literal('')),
  workingHoursStart: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)').optional().or(z.literal('')),
  workingHoursEnd: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)').optional().or(z.literal('')),
});

export type DeliveryBoyFormData = z.infer<typeof deliveryBoySchema>;