'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import {
  CATEGORY_OPTIONS,
  PAYMENT_STATUS_OPTIONS,
  APPROVAL_STATUS_OPTIONS,
} from '@/lib/constants/expense';
import type { ExpenseFilters } from '@/lib/types/expense';

interface ExpenseFiltersComponentProps {
  filters: ExpenseFilters;
  onFiltersChange: (filters: ExpenseFilters) => void;
}

export function ExpenseFiltersComponent({ 
  filters, 
  onFiltersChange 
}: ExpenseFiltersComponentProps) {
  const handleFilterChange = (key: keyof ExpenseFilters, value: string) => {
    // Handle "all" value as undefined to clear the filter
    const actualValue = value === 'all' ? undefined : value;
    onFiltersChange({
      ...filters,
      [key]: actualValue,
      page: 1, // Reset to first page when filters change
    });
  };

  const handleClearFilters = () => {
    onFiltersChange({
      page: 1,
      limit: filters.limit || 10,
    });
  };

  const hasActiveFilters = 
    filters.search || 
    filters.category || 
    filters.paymentStatus || 
    filters.approvalStatus ||
    filters.startDate ||
    filters.endDate;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search expenses..."
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label>Category</Label>
          <Select
            value={filters.category || 'all'}
            onValueChange={(value) => handleFilterChange('category', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {CATEGORY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Payment Status */}
        <div className="space-y-2">
          <Label>Payment Status</Label>
          <Select
            value={filters.paymentStatus || 'all'}
            onValueChange={(value) => handleFilterChange('paymentStatus', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {PAYMENT_STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Approval Status */}
        <div className="space-y-2">
          <Label>Approval Status</Label>
          <Select
            value={filters.approvalStatus || 'all'}
            onValueChange={(value) => handleFilterChange('approvalStatus', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {APPROVAL_STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date Range */}
        <div className="space-y-2">
          <Label>Start Date</Label>
          <Input
            type="date"
            value={filters.startDate || ''}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>End Date</Label>
          <Input
            type="date"
            value={filters.endDate || ''}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
          />
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="h-8"
          >
            <X className="h-3 w-3 mr-2" />
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}