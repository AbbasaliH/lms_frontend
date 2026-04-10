import { z } from 'zod';

export const orderItemSchema = z.object({
  serviceType: z.string().min(1, 'Service type is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  notes: z.string().optional(),
});

export const orderSchema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  deliveryDate: z.date({
    message: 'Delivery date is required',
  }),
  items: z.array(orderItemSchema).min(1, 'At least one item is required'),
  paymentMethod: z.enum(['cash', 'card', 'upi'], {
    message: 'Payment method is required',
  }),
  assignedTo: z.string().optional(),
  specialInstructions: z.string().optional(),
});

export type OrderFormData = z.infer<typeof orderSchema>;
export type OrderItemFormData = z.infer<typeof orderItemSchema>;