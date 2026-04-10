'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, RefreshCcw, AlertTriangle } from 'lucide-react';
import type { ApiPayment } from '@/lib/types/payment';
import { Alert, AlertDescription } from '@/components/ui/alert';

const refundSchema = z.object({
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  reason: z.string().min(10, 'Please provide a detailed reason (min 10 characters)'),
});

type RefundFormData = z.infer<typeof refundSchema>;

interface RefundPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: ApiPayment | null;
  onSubmit: (paymentId: string, amount: number, reason: string) => Promise<void>;
}

export function RefundPaymentDialog({
  open,
  onOpenChange,
  payment,
  onSubmit,
}: RefundPaymentDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const maxRefundAmount = payment
    ? payment.amount - payment.refundAmount
    : 0;

  const form = useForm<RefundFormData>({
    resolver: zodResolver(refundSchema),
    defaultValues: {
      amount: maxRefundAmount,
      reason: '',
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = form;

  const refundAmount = watch('amount');

  const handleFormSubmit = async (data: RefundFormData) => {
    if (!payment) return;

    setIsSubmitting(true);
    try {
      await onSubmit(payment.id, data.amount, data.reason);
      onOpenChange(false);
      reset();
    } catch (error) {
      console.error('Failed to refund payment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) reset();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCcw className="h-5 w-5" />
            Refund Payment
          </DialogTitle>
          <DialogDescription>
            Process a refund for payment #{payment?.id.slice(0, 8)}
          </DialogDescription>
        </DialogHeader>

        {payment && (
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* Payment Info */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Original Amount:</span>
                <span className="font-semibold">${payment.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Already Refunded:</span>
                <span className="font-semibold text-destructive">
                  -${payment.refundAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm border-t pt-2">
                <span className="text-muted-foreground">Available for Refund:</span>
                <span className="font-bold">${maxRefundAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Warning Alert */}
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                This action cannot be undone. The refund will be processed immediately.
              </AlertDescription>
            </Alert>

            {/* Refund Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">
                Refund Amount <span className="text-destructive">*</span>
              </Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    max={maxRefundAmount}
                    placeholder="0.00"
                    className="pl-7"
                    {...register('amount', { valueAsNumber: true })}
                    aria-invalid={!!errors.amount}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setValue('amount', maxRefundAmount)}
                  disabled={isSubmitting}
                >
                  Full
                </Button>
              </div>
              {errors.amount && (
                <p className="text-sm text-destructive">{errors.amount.message}</p>
              )}
              {refundAmount > maxRefundAmount && (
                <p className="text-sm text-destructive">
                  Amount cannot exceed ${maxRefundAmount.toFixed(2)}
                </p>
              )}
            </div>

            {/* Refund Reason */}
            <div className="space-y-2">
              <Label htmlFor="reason">
                Reason for Refund <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="reason"
                placeholder="Please provide a detailed reason for this refund..."
                rows={4}
                {...register('reason')}
                aria-invalid={!!errors.reason}
              />
              {errors.reason && (
                <p className="text-sm text-destructive">{errors.reason.message}</p>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onOpenChange(false);
                  reset();
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={isSubmitting || refundAmount > maxRefundAmount}
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Process Refund
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
