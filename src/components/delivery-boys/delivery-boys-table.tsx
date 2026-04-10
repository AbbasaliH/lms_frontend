'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { DeliveryBoyDetailDialog } from './delivery-boy-detail-dialog';
</xai:function_call >

<xai:function_call name="edit_file">
<parameter name="path">e:/laundry/website/src/components/delivery-boys/delivery-boys-table.tsx
import { DeliveryBoyStatus, VehicleType } from '@/lib/types/delivery-boy';
import type { ApiDeliveryBoyItem } from '@/lib/types/delivery-boy';
import { useUpdateDeliveryBoyStatus, useDeleteDeliveryBoy } from '@/lib/hooks/use-delivery-boys';
import { MoreHorizontal, Trash2, Edit } from 'lucide-react';

interface DeliveryBoysTableProps {
  deliveryBoys: ApiDeliveryBoyItem[];
  isLoading?: boolean;
  onEdit: (deliveryBoy: ApiDeliveryBoyItem) => void;
  pagination: { page: number; limit: number; total?: number };
  onPaginationChange: (pagination: { page: number; limit: number }) => void;
}

export default function DeliveryBoysTable({
  deliveryBoys,
  isLoading = false,
  onEdit,
  pagination,
  onPaginationChange,
}: DeliveryBoysTableProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const updateStatusMutation = useUpdateDeliveryBoyStatus();
  const deleteMutation = useDeleteDeliveryBoy();

  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedDeliveryBoy, setSelectedDeliveryBoy] = useState<ApiDeliveryBoyItem | null>(null);

  const statusVariantMap: Record<DeliveryBoyStatus, 'default' | 'secondary' | 'outline' | 'destructive'> = {
    ACTIVE: 'default',
    INACTIVE: 'secondary',
    ON_LEAVE: 'outline',
    SUSPENDED: 'destructive',
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="space-y-4">
            {[1,2,3,4].map((i) => (
              <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                <div className="h-12 w-12 bg-muted rounded-full animate-pulse" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Vehicle</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Deliveries</TableHead>
            <TableHead>Earnings</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {deliveryBoys.map((deliveryBoy) => (
            <TableRow key={deliveryBoy.id}>
              <TableCell className="font-medium">{deliveryBoy.fullName}</TableCell>
              <TableCell>{deliveryBoy.phoneNumber}</TableCell>
              <TableCell>
                <div>
                  <span className="text-sm">{deliveryBoy.deliveryBoy.vehicleType}</span>
                  {deliveryBoy.deliveryBoy.vehicleNumber && (
                    <p className="text-xs text-muted-foreground">{deliveryBoy.deliveryBoy.vehicleNumber}</p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={statusVariantMap[deliveryBoy.deliveryBoy.status as DeliveryBoyStatus]}>
                  {deliveryBoy.deliveryBoy.status}
                </Badge>
              </TableCell>
              <TableCell>{deliveryBoy.deliveryBoy.totalDeliveries}</TableCell>
              <TableCell>₹{deliveryBoy.deliveryBoy.earnings.toLocaleString()}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => {
                      setSelectedDeliveryBoy(deliveryBoy);
                      setDetailOpen(true);
                    }}>
                      <span>View Details</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(deliveryBoy)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => updateStatusMutation.mutate({ id: deliveryBoy.id, data: { status: DeliveryBoyStatus.ACTIVE } })}

                      disabled={deliveryBoy.deliveryBoy.status === 'ACTIVE'}
                    >
                      Set Active
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => updateStatusMutation.mutate({ id: deliveryBoy.id, data: { status: DeliveryBoyStatus.INACTIVE } })}

                    >
                      Set Inactive
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => deleteMutation.mutate(deliveryBoy.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {deliveryBoys.length === 0 && !isLoading && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">No delivery boys found.</p>
          </CardContent>
        </Card>
      )}

      <DeliveryBoyDetailDialog 
        deliveryBoy={selectedDeliveryBoy} 
        open={detailOpen} 
        onOpenChange={setDetailOpen} 
        onEdit={onEdit}
      />
    </>
  );
}
