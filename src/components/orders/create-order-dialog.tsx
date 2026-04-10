'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { OrderForm } from '@/components/forms/order-form';
import type { OrderFormData } from '@/lib/schemas/order-schema';
import { toast } from 'sonner';

interface CreateOrderDialogProps {
  children?: React.ReactNode;
  onSuccess?: () => void;
}

export function CreateOrderDialog({ children, onSuccess }: CreateOrderDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: OrderFormData) => {
    setIsSubmitting(true);
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Order data:', data);
      toast.success('Order created successfully!');
      setIsOpen(false);
      onSuccess?.();
    } catch (error) {
      toast.error('Failed to create order');
      console.error('Error creating order:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Order</DialogTitle>
          <DialogDescription>
            Create a new order for a customer. Add services and set delivery details.
          </DialogDescription>
        </DialogHeader>
        <OrderForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </DialogContent>
    </Dialog>
  );
}
