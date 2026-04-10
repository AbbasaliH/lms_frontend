'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, AlertTriangle } from 'lucide-react';
import { ApiOrder } from '@/lib/types/api';

interface CancelOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: ApiOrder | null;
  onSubmit: (orderId: string, reason?: string) => Promise<void>;
}

export function CancelOrderDialog({
  open,
  onOpenChange,
  order,
  onSubmit,
}: CancelOrderDialogProps) {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!order) return;

    setIsSubmitting(true);
    try {
      await onSubmit(order.id, reason);
      onOpenChange(false);
      setReason('');
    } catch (error) {
      console.error('Failed to cancel order:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Cancel Order
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel order #{order?.id.slice(0, 8)}...? This action cannot
            be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Cancellation Reason (Optional)</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for cancellation..."
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Keep Order
          </Button>
          <Button variant="destructive" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Cancel Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
