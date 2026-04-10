'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, Pencil, Trash2, Building2, Phone, Mail } from 'lucide-react';
import { useSuppliers, useDeleteSupplier, useSupplierDashboard } from '@/lib/hooks/use-suppliers';
import { SupplierFiltersComponent } from '@/components/suppliers/supplier-filters';
import { StatusBadge } from '@/components/suppliers/supplier-status-badge';
import { RatingStars } from '@/components/suppliers/rating-stars';
import { StatsCard } from '@/components/dashboard/stats-card';
import { formatCurrency, formatPhoneNumber } from '@/lib/utils/format';
import type { SupplierFilters } from '@/lib/types/supplier';

export default function SuppliersPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<SupplierFilters>({
    page: 1,
    limit: 10,
  });

  const { data: dashboardData, isLoading: dashboardLoading } = useSupplierDashboard();
  const { data, isLoading, error } = useSuppliers(filters);
  const deleteMutation = useDeleteSupplier();

  const suppliers = data?.data?.suppliers || [];
  const pagination = data?.data?.pagination;

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this supplier? This action cannot be undone.')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Supplier Management</h1>
          <p className="text-muted-foreground mt-1">Manage your suppliers, orders, and payments</p>
        </div>
        <Button onClick={() => router.push('/admin/suppliers/create')}>
          <Plus className="h-4 w-4 mr-2" />
          Add Supplier
        </Button>
      </div>

      {/* Dashboard Stats */}
      {dashboardLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : dashboardData?.data ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Suppliers"
            value={dashboardData.data.totalSuppliers}
            icon={Building2}
            description={`${dashboardData.data.activeSuppliers} active`}
          />
          <StatsCard
            title="Pending Approvals"
            value={dashboardData.data.pendingApprovals}
            icon={Building2}
            description="Awaiting verification"
          />
          <StatsCard
            title="Total Outstanding"
            value={formatCurrency(dashboardData.data.totalOutstanding)}
            icon={Building2}
            description="Payment pending"
          />
          <StatsCard
            title="Average Rating"
            value={dashboardData.data.avgRating.toFixed(1)}
            icon={Building2}
            description={`${dashboardData.data.totalPurchaseOrders} total orders`}
          />
        </div>
      ) : null}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <SupplierFiltersComponent filters={filters} onFiltersChange={setFilters} />
        </CardContent>
      </Card>

      {/* Suppliers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Suppliers ({pagination?.total || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8 text-destructive">
              Failed to load suppliers. Please try again.
            </div>
          ) : suppliers.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No suppliers found</h3>
              <p className="text-muted-foreground mb-4">
                Get started by adding your first supplier
              </p>
              <Button onClick={() => router.push('/admin/suppliers/create')}>
                <Plus className="h-4 w-4 mr-2" />
                Add Supplier
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Contact Person</TableHead>
                      <TableHead>Contact Info</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Tier</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead>Outstanding</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {suppliers.map((supplier) => (
                      <TableRow key={supplier.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div className="font-medium">{supplier.companyName}</div>
                            <div className="text-sm text-muted-foreground">
                              {supplier.city}, {supplier.state}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{supplier.contactPerson}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center text-sm">
                              <Phone className="h-3 w-3 mr-1" />
                              {formatPhoneNumber(supplier.phoneNumber)}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Mail className="h-3 w-3 mr-1" />
                              {supplier.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{supplier.supplierType}</Badge>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={supplier.status} type="status" />
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={supplier.tier} type="tier" />
                        </TableCell>
                        <TableCell>
                          <RatingStars rating={supplier.rating} />
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-medium">{supplier.totalOrders}</div>
                            <div className="text-muted-foreground">
                              {supplier.completedOrders} completed
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {formatCurrency(supplier.currentOutstanding)}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/admin/suppliers/${supplier.id}`)}
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/admin/suppliers/${supplier.id}/edit`)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(supplier.id)}
                              disabled={deleteMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}