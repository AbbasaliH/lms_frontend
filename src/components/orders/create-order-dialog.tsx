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
import { useCreateOrder } from '@/lib/hooks/use-user-orders';
import { toast } from 'sonner';
import { ordersApi } from '@/lib/api/orders';
import { servicesApi } from '@/lib/api/services';

interface CreateOrderDialogProps {
  children?: React.ReactNode;
  onSuccess?: () => void;
}

export function CreateOrderDialog({ children, onSuccess }: CreateOrderDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const createOrder = useCreateOrder();

  const handleSubmit = async (data: OrderFormData) => {
    try {
      await createOrder.mutateAsync(data);
      setIsOpen(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to create order');
      console.error('Error creating order:', error);
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
        <OrderForm onSubmit={handleSubmit} isSubmitting={createOrder.isPending} />
      </DialogContent>
    </Dialog>
  );
}
