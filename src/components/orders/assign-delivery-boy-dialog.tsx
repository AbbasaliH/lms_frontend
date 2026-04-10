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
import { Loader2, Truck } from 'lucide-react';
import { ApiOrder } from '@/lib/types/api';
import { useDeliveryBoys } from '@/lib/hooks/use-delivery-boys';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserStatus } from '@/lib/types/delivery-boy';

interface AssignDeliveryBoyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: ApiOrder | null;
  onSubmit: (orderId: string, deliveryBoyId: string) => Promise<void>;
}

export function AssignDeliveryBoyDialog({
  open,
  onOpenChange,
  order,
  onSubmit,
}: AssignDeliveryBoyDialogProps) {
  const [deliveryBoyId, setDeliveryBoyId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch available delivery boys
  const { data: deliveryBoysData, isLoading } = useDeliveryBoys(
    {},
    { page: 1, limit: 100 }
  );

  // Filter approved delivery boys
  const deliveryBoys = (deliveryBoysData?.data || []).filter(
    (db) => db.status === UserStatus.APPROVED
  );

  const handleSubmit = async () => {
    if (!order || !deliveryBoyId) return;

    setIsSubmitting(true);
    try {
      await onSubmit(order.id, deliveryBoyId);
      onOpenChange(false);
      setDeliveryBoyId('');
    } catch (error) {
      console.error('Failed to assign delivery boy:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Assign Delivery Personnel
          </DialogTitle>
          <DialogDescription>
            Assign a delivery person to order #{order?.id.slice(0, 8)}...
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {order?.deliveryBoy && (
            <div className="space-y-2">
              <Label>Currently Assigned</Label>
              <div className="text-sm font-medium bg-muted p-3 rounded-lg">
                {order.deliveryBoy.fullName} - {order.deliveryBoy.phoneNumber}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="delivery-boy">
              {order?.deliveryBoy ? 'Reassign to' : 'Assign to'}
            </Label>
            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : (
              <Select value={deliveryBoyId} onValueChange={setDeliveryBoyId}>
                <SelectTrigger id="delivery-boy">
                  <SelectValue placeholder="Select delivery person" />
                </SelectTrigger>
                <SelectContent>
                  <ScrollArea className="h-[200px]">
                    {deliveryBoys.map((db) => (
                      <SelectItem key={db.id} value={db.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{db.fullName}</span>
                          <span className="text-xs text-muted-foreground">
                            {db.phoneNumber}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </ScrollArea>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || !deliveryBoyId}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {order?.deliveryBoy ? 'Reassign' : 'Assign'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
