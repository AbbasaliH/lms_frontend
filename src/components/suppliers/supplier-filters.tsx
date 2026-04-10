'use client';

import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { SupplierStatus, SupplierType, VerificationStatus, SupplierTier, SupplierFilters } from '@/lib/types/supplier';

interface SupplierFiltersProps {
  filters: SupplierFilters;
  onFiltersChange: (filters: SupplierFilters) => void;
}

export function SupplierFiltersComponent({ filters, onFiltersChange }: SupplierFiltersProps) {
  const handleReset = () => {
    onFiltersChange({
      page: 1,
      limit: 10,
    });
  };

  const hasActiveFilters = filters.status || filters.supplierType || filters.verificationStatus || filters.tier || filters.search;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by company, contact, email, phone..."
            value={filters.search || ''}
            onChange={(e) =>
              onFiltersChange({ ...filters, search: e.target.value, page: 1 })
            }
            className="pl-9"
          />
        </div>

        {/* Status Filter */}
        <Select
          value={filters.status || 'all'}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              status: value === 'all' ? undefined : (value as SupplierStatus),
              page: 1,
            })
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="INACTIVE">Inactive</SelectItem>
            <SelectItem value="SUSPENDED">Suspended</SelectItem>
            <SelectItem value="BLACKLISTED">Blacklisted</SelectItem>
          </SelectContent>
        </Select>

        {/* Type Filter */}
        <Select
          value={filters.supplierType || 'all'}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              supplierType: value === 'all' ? undefined : (value as SupplierType),
              page: 1,
            })
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="MATERIAL">Material</SelectItem>
            <SelectItem value="EQUIPMENT">Equipment</SelectItem>
            <SelectItem value="CHEMICAL">Chemical</SelectItem>
            <SelectItem value="PACKAGING">Packaging</SelectItem>
            <SelectItem value="SERVICE">Service</SelectItem>
            <SelectItem value="MIXED">Mixed</SelectItem>
          </SelectContent>
        </Select>

        {/* Verification Filter */}
        <Select
          value={filters.verificationStatus || 'all'}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              verificationStatus: value === 'all' ? undefined : (value as VerificationStatus),
              page: 1,
            })
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Verification" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Verification</SelectItem>
            <SelectItem value="VERIFIED">Verified</SelectItem>
            <SelectItem value="UNVERIFIED">Unverified</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>

        {/* Tier Filter */}
        <Select
          value={filters.tier || 'all'}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              tier: value === 'all' ? undefined : (value as SupplierTier),
              page: 1,
            })
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tier" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tiers</SelectItem>
            <SelectItem value="PREMIUM">Premium</SelectItem>
            <SelectItem value="STANDARD">Standard</SelectItem>
            <SelectItem value="BASIC">Basic</SelectItem>
          </SelectContent>
        </Select>

        {/* Reset Button */}
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={handleReset}>
            <X className="h-4 w-4 mr-2" />
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}