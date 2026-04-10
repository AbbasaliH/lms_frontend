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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { ApiOrder } from '@/lib/types/api';

interface UpdateStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: ApiOrder | null;
  onSubmit: (orderId: string, status: string) => Promise<void>;
}

const statusOptions = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'PROCESSING', label: 'Processing' },
  { value: 'READY', label: 'Ready' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export function UpdateStatusDialog({
  open,
  onOpenChange,
  order,
  onSubmit,
}: UpdateStatusDialogProps) {
  const [status, setStatus] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!order || !status) return;

    setIsSubmitting(true);
    try {
      await onSubmit(order.id, status);
      onOpenChange(false);
      setStatus('');
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Order Status</DialogTitle>
          <DialogDescription>
            Change the status of order #{order?.id.slice(0, 8)}...
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="status">Current Status</Label>
            <div className="text-sm font-medium">{order?.status}</div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-status">New Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="new-status">
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || !status}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update Status
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
