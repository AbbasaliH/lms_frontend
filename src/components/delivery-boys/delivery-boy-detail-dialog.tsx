'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { DeliveryBoyStats } from './delivery-boy-stats';
import type { ApiDeliveryBoyItem } from '@/lib/types/delivery-boy';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Car, 
  CreditCard, 
  Clock, 
  Calendar,
  Edit,
  Activity
} from 'lucide-react';
import { format } from 'date-fns';

interface DeliveryBoyDetailDialogProps {
  deliveryBoy: ApiDeliveryBoyItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (deliveryBoy: ApiDeliveryBoyItem) => void;
}

export function DeliveryBoyDetailDialog({
  deliveryBoy,
  open,
  onOpenChange,
  onEdit,
}: DeliveryBoyDetailDialogProps) {
  if (!deliveryBoy) return null;

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'default';
      case 'INACTIVE':
        return 'secondary';
      case 'ON_LEAVE':
        return 'outline';
      case 'SUSPENDED':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'Active';
      case 'INACTIVE':
        return 'Inactive';
      case 'ON_LEAVE':
        return 'On Leave';
      case 'SUSPENDED':
        return 'Suspended';
      default:
        return status;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Delivery Boy Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Section */}
          <div className="flex items-start gap-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-lg">
                {getInitials(deliveryBoy.fullName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{deliveryBoy.fullName}</h3>
                  <p className="text-sm text-muted-foreground">ID: {deliveryBoy.id}</p>
                </div>
                <div className="flex gap-2">
                  <Badge variant={getStatusBadgeVariant(deliveryBoy.deliveryBoy.status)}>
                    {getStatusLabel(deliveryBoy.deliveryBoy.status)}
                  </Badge>
                  <Badge variant={deliveryBoy.deliveryBoy.isAvailable ? 'default' : 'secondary'}>
                    {deliveryBoy.deliveryBoy.isAvailable ? 'Available' : 'Unavailable'}
                  </Badge>
                </div>
              </div>
              {onEdit && (
                <Button size="sm" onClick={() => onEdit(deliveryBoy)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Details
                </Button>
              )}
            </div>
          </div>

          <Separator />

          {/* Performance Stats */}
          <div>
            <h4 className="mb-4 text-sm font-semibold">Performance Metrics</h4>
            <DeliveryBoyStats
              totalDeliveries={deliveryBoy.deliveryBoy.totalDeliveries}
              successfulDeliveries={deliveryBoy.deliveryBoy.successfulDeliveries}
              averageRating={deliveryBoy.deliveryBoy.averageRating || 0}
              earnings={deliveryBoy.deliveryBoy.earnings}
            />
          </div>

          <Separator />

          {/* Contact Information */}
          <div>
            <h4 className="mb-4 text-sm font-semibold">Contact Information</h4>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium">{deliveryBoy.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium">{deliveryBoy.phoneNumber}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Vehicle Information */}
          <div>
            <h4 className="mb-4 text-sm font-semibold">Vehicle Information</h4>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <Car className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Vehicle Type</p>
                  <p className="text-sm font-medium">{deliveryBoy.deliveryBoy.vehicleType}</p>
                </div>
              </div>
              {deliveryBoy.deliveryBoy.vehicleNumber && (
                <div className="flex items-center gap-3">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Vehicle Number</p>
                    <p className="text-sm font-medium">{deliveryBoy.deliveryBoy.vehicleNumber}</p>
                  </div>
                </div>
              )}
              {deliveryBoy.deliveryBoy.licenseNumber && (
                <div className="flex items-center gap-3">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">License Number</p>
                    <p className="text-sm font-medium">{deliveryBoy.deliveryBoy.licenseNumber}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Additional Information */}
          <div>
            <h4 className="mb-4 text-sm font-semibold">Additional Information</h4>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Joined On</p>
                  <p className="text-sm font-medium">
                    {format(new Date(deliveryBoy.createdAt), 'PPP')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Gender</p>
                  <p className="text-sm font-medium">{deliveryBoy.gender}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Total Orders</p>
                  <p className="text-sm font-medium">{deliveryBoy._count.deliveryOrders}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}