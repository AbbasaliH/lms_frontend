'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Filter, X } from 'lucide-react';
import { NotificationType, NotificationPriority } from '@/lib/types/notification';

interface NotificationFiltersProps {
  filters: {
    isRead?: boolean;
    type?: NotificationType;
    priority?: NotificationPriority;
  };
  onFilterChange: (filters: any) => void;
}

export function NotificationFilters({ filters, onFilterChange }: NotificationFiltersProps) {
  const hasActiveFilters = filters.isRead !== undefined || filters.type || filters.priority;

  const clearFilters = () => {
    onFilterChange({});
  };

  const updateFilter = (key: string, value: any) => {
    onFilterChange({
      ...filters,
      [key]: value === 'all' ? undefined : value,
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Filter className="h-4 w-4" />
        <span>Filters:</span>
      </div>

      {/* Read Status Filter */}
      <Select
        value={filters.isRead === undefined ? 'all' : filters.isRead ? 'read' : 'unread'}
        onValueChange={(value) => {
          if (value === 'all') {
            updateFilter('isRead', undefined);
          } else {
            updateFilter('isRead', value === 'read');
          }
        }}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="unread">Unread</SelectItem>
          <SelectItem value="read">Read</SelectItem>
        </SelectContent>
      </Select>

      {/* Type Filter */}
      <Select
        value={filters.type || 'all'}
        onValueChange={(value) => updateFilter('type', value)}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value={NotificationType.INFO}>Info</SelectItem>
          <SelectItem value={NotificationType.SUCCESS}>Success</SelectItem>
          <SelectItem value={NotificationType.WARNING}>Warning</SelectItem>
          <SelectItem value={NotificationType.ERROR}>Error</SelectItem>
          <SelectItem value={NotificationType.ORDER_UPDATE}>Order Update</SelectItem>
          <SelectItem value={NotificationType.PAYMENT}>Payment</SelectItem>
          <SelectItem value={NotificationType.DELIVERY}>Delivery</SelectItem>
          <SelectItem value={NotificationType.PROMOTION}>Promotion</SelectItem>
          <SelectItem value={NotificationType.SYSTEM}>System</SelectItem>
          <SelectItem value={NotificationType.REMINDER}>Reminder</SelectItem>
        </SelectContent>
      </Select>

      {/* Priority Filter */}
      <Select
        value={filters.priority || 'all'}
        onValueChange={(value) => updateFilter('priority', value)}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Priorities</SelectItem>
          <SelectItem value={NotificationPriority.URGENT}>Urgent</SelectItem>
          <SelectItem value={NotificationPriority.HIGH}>High</SelectItem>
          <SelectItem value={NotificationPriority.NORMAL}>Normal</SelectItem>
          <SelectItem value={NotificationPriority.LOW}>Low</SelectItem>
        </SelectContent>
      </Select>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="h-9"
        >
          <X className="h-4 w-4 mr-1" />
          Clear filters
        </Button>
      )}

      {/* Active Filter Badges */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 ml-2">
          {filters.isRead !== undefined && (
            <Badge variant="secondary">
              {filters.isRead ? 'Read' : 'Unread'}
            </Badge>
          )}
          {filters.type && (
            <Badge variant="secondary">
              Type: {filters.type}
            </Badge>
          )}
          {filters.priority && (
            <Badge variant="secondary">
              Priority: {filters.priority}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
