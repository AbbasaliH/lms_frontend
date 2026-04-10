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
import { format } from 'date-fns';
import {
  CreditCard,
  User,
  Package,
  Calendar,
  DollarSign,
  Hash,
  CheckCircle2,
} from 'lucide-react';
import type { ApiPayment } from '@/lib/types/payment';

interface PaymentDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: ApiPayment | null;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20';
    case 'pending':
      return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20';
    case 'processing':
      return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20';
    case 'failed':
      return 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20';
    case 'refunded':
      return 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20';
    case 'cancelled':
      return 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20';
    default:
      return 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20';
  }
};

const getMethodColor = (method: string) => {
  switch (method.toLowerCase()) {
    case 'card':
      return 'bg-blue-500/10 text-blue-700 dark:text-blue-400';
    case 'upi':
      return 'bg-green-500/10 text-green-700 dark:text-green-400';
    case 'cash':
      return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
    case 'wallet':
      return 'bg-purple-500/10 text-purple-700 dark:text-purple-400';
    default:
      return 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
  }
};

export function PaymentDetailDialog({
  open,
  onOpenChange,
  payment,
}: PaymentDetailDialogProps) {
  if (!payment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Details
          </DialogTitle>
          <DialogDescription>
            Complete information about payment #{payment.id.slice(0, 8)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Method */}
          <div className="flex items-center gap-3">
            <Badge className={`border ${getStatusColor(payment.status)}`}>
              {payment.status}
            </Badge>
            <Badge className={getMethodColor(payment.paymentMethod)}>
              {payment.paymentMethod}
            </Badge>
            <Badge variant="outline">{payment.type}</Badge>
          </div>

          <Separator />

          {/* Amount Details */}
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Amount Details
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-2xl font-bold">${payment.amount.toFixed(2)}</p>
              </div>
              {payment.refundAmount > 0 && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Refund Amount</p>
                  <p className="text-2xl font-bold text-destructive">
                    -${payment.refundAmount.toFixed(2)}
                  </p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Customer Information */}
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <User className="h-4 w-4" />
              Customer Information
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{payment.user.fullName}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium text-sm">{payment.user.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{payment.user.phoneNumber}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Customer ID</p>
                <p className="font-mono text-sm">#{payment.userId.slice(0, 8)}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Order Information */}
          {payment.orderId && (
            <>
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Order Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Order ID</p>
                    <p className="font-mono">#{payment.orderId.slice(0, 8)}</p>
                  </div>
                  {payment.order && (
                    <>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Order Status</p>
                        <Badge variant="outline">{payment.order.status}</Badge>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Order Amount</p>
                        <p className="font-medium">${payment.order.totalAmount.toFixed(2)}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Transaction Details */}
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <Hash className="h-4 w-4" />
              Transaction Details
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Payment ID</p>
                <p className="font-mono text-sm">#{payment.id}</p>
              </div>
              {payment.transactionId && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Transaction ID</p>
                  <p className="font-mono text-sm">{payment.transactionId}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Dates */}
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Timeline
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Created At</p>
                <p className="text-sm">
                  {format(new Date(payment.createdAt), 'MMM dd, yyyy hh:mm a')}
                </p>
              </div>
              {payment.paidAt && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Paid At</p>
                  <p className="text-sm flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-green-600" />
                    {format(new Date(payment.paidAt), 'MMM dd, yyyy hh:mm a')}
                  </p>
                </div>
              )}
              {payment.refundedAt && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Refunded At</p>
                  <p className="text-sm text-destructive">
                    {format(new Date(payment.refundedAt), 'MMM dd, yyyy hh:mm a')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Refund Reason */}
          {payment.refundReason && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Refund Reason</h4>
                <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                  {payment.refundReason}
                </p>
              </div>
            </>
          )}

          {/* Gateway Response */}
          {payment.gatewayResponse && Object.keys(payment.gatewayResponse).length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Gateway Response</h4>
                <pre className="text-xs bg-muted p-3 rounded-lg overflow-x-auto">
                  {JSON.stringify(payment.gatewayResponse, null, 2)}
                </pre>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
