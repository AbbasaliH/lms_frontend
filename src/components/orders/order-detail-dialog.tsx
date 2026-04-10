'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ApiOrder } from '@/lib/types/api';
import { format } from 'date-fns';
import { Calendar, User, Phone, Package, Truck, DollarSign, Clock } from 'lucide-react';

interface OrderDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: ApiOrder | null;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
    case 'processing':
      return 'bg-blue-500/10 text-blue-700 dark:text-blue-400';
    case 'ready':
      return 'bg-green-500/10 text-green-700 dark:text-green-400';
    case 'delivered':
      return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400';
    case 'cancelled':
      return 'bg-red-500/10 text-red-700 dark:text-red-400';
    default:
      return 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
  }
};

export function OrderDetailDialog({ open, onOpenChange, order }: OrderDetailDialogProps) {
  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription>
            Order ID: #{order.id.slice(0, 8)}...
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status */}
          <div>
            <Badge className={getStatusColor(order.status)}>
              {order.status}
            </Badge>
          </div>

          <Separator />

          {/* Customer Information */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <User className="h-4 w-4" />
              Customer Information
            </h3>
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name:</span>
                <span className="font-medium">{order.user.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phone:</span>
                <span className="font-medium">{order.user.phoneNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Gender:</span>
                <span className="font-medium capitalize">{order.user.gender.toLowerCase()}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Product Information */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Package className="h-4 w-4" />
              Product Information
            </h3>
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Product:</span>
                <span className="font-medium">{order.product.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category:</span>
                <span className="font-medium">{order.product.category}</span>
              </div>
              {order.product.description && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Description:</span>
                  <span className="font-medium text-right max-w-xs">
                    {order.product.description}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Unit Price:</span>
                <span className="font-medium">${order.product.price.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Delivery Information */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Delivery Information
            </h3>
            <div className="grid gap-2 text-sm">
              {order.deliveryBoy ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery Person:</span>
                    <span className="font-medium">{order.deliveryBoy.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Contact:</span>
                    <span className="font-medium">{order.deliveryBoy.phoneNumber}</span>
                  </div>
                </>
              ) : (
                <div className="text-muted-foreground italic">Not assigned yet</div>
              )}
              {order.deadline && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Deadline:</span>
                  <span className="font-medium">
                    {format(new Date(order.deadline), 'MMM dd, yyyy hh:mm a')}
                  </span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Order Details */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Order Details
            </h3>
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order Date:</span>
                <span className="font-medium">
                  {format(new Date(order.createdAt), 'MMM dd, yyyy hh:mm a')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Recurring:</span>
                <span className="font-medium">{order.isRecurring ? 'Yes' : 'No'}</span>
              </div>
              {order.specialInstructions && (
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground">Special Instructions:</span>
                  <span className="font-medium bg-muted p-2 rounded">
                    {order.specialInstructions}
                  </span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Payment */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Payment
            </h3>
            <div className="bg-primary/5 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total Amount:</span>
                <span className="text-2xl font-bold">${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
