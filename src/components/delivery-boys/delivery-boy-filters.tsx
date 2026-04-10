'use client';

import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { VehicleType, DeliveryBoyStatus } from '@/lib/types/delivery-boy';

interface DeliveryBoyFiltersProps {
  search: string;
  status: DeliveryBoyStatus | 'ALL';
  vehicleType: VehicleType | 'ALL';
  isAvailable: 'ALL' | 'true' | 'false';
  onSearchChange: (value: string) => void;
  onStatusChange: (value: DeliveryBoyStatus | 'ALL') => void;
  onVehicleTypeChange: (value: VehicleType | 'ALL') => void;
  onAvailabilityChange: (value: 'ALL' | 'true' | 'false') => void;
  onReset: () => void;
}

export function DeliveryBoyFilters({
  search,
  status,
  vehicleType,
  isAvailable,
  onSearchChange,
  onStatusChange,
  onVehicleTypeChange,
  onAvailabilityChange,
  onReset,
}: DeliveryBoyFiltersProps) {
  const hasActiveFilters = search || status !== 'ALL' || vehicleType !== 'ALL' || isAvailable !== 'ALL';

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name or phone..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value={DeliveryBoyStatus.ACTIVE}>Active</SelectItem>
            <SelectItem value={DeliveryBoyStatus.INACTIVE}>Inactive</SelectItem>
            <SelectItem value={DeliveryBoyStatus.ON_LEAVE}>On Leave</SelectItem>
            <SelectItem value={DeliveryBoyStatus.SUSPENDED}>Suspended</SelectItem>
          </SelectContent>
        </Select>

        <Select value={vehicleType} onValueChange={onVehicleTypeChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Vehicle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Vehicles</SelectItem>
            <SelectItem value={VehicleType.BICYCLE}>Bicycle</SelectItem>
            <SelectItem value={VehicleType.BIKE}>Bike</SelectItem>
            <SelectItem value={VehicleType.SCOOTER}>Scooter</SelectItem>
            <SelectItem value={VehicleType.CAR}>Car</SelectItem>
            <SelectItem value={VehicleType.VAN}>Van</SelectItem>
          </SelectContent>
        </Select>

        <Select value={isAvailable} onValueChange={onAvailabilityChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Availability" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All</SelectItem>
            <SelectItem value="true">Available</SelectItem>
            <SelectItem value="false">Unavailable</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="outline" size="icon" onClick={onReset} title="Clear filters">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}