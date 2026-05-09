'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import {
  Users,
  TrendingUp,
  UserCheck,
  Building2,
  Search,
  Filter,
  MoreHorizontal,
  Loader2,
  Phone,
  Mail,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AddCustomerDialog } from '@/components/customers/add-customer-dialog';
import { CustomerTierBadge } from '@/components/customers/customer-tier-badge';
import { useCustomers, useUpdateCustomerStatus } from '@/lib/hooks/use-customers';
import type { ApiCustomer } from '@/lib/types/customer';
import { toast } from 'sonner';

const getStatusBadge = (status: string, isBlacklisted: boolean) => {
  if (isBlacklisted) {
    return <Badge variant="destructive">Blacklisted</Badge>;
  }

  switch (status) {
    case 'ACTIVE':
      return <Badge className="bg-success text-success-foreground">Active</Badge>;
    case 'INACTIVE':
      return <Badge variant="secondary">Inactive</Badge>;
    case 'SUSPENDED':
      return <Badge className="bg-warning text-warning-foreground">Suspended</Badge>;
    case 'BLOCKED':
      return <Badge variant="destructive">Blocked</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default function CustomersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError, error } = useCustomers({
    page,
    limit,
    search: searchQuery || undefined,
  });

  const updateStatusMutation = useUpdateCustomerStatus();

  const customers = (data as any)?.data?.customers || [];
  const pagination = (data as any)?.data?.pagination;

  const stats = {
    totalCustomers: pagination?.total || 0,
    activeCustomers: customers.filter((c: ApiCustomer) => c.status === 'ACTIVE').length,
    verifiedCustomers: customers.filter((c: ApiCustomer) => c.isVerified).length,
    businessCustomers: customers.filter((c: ApiCustomer) => c.isBusinessCustomer).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
          <p className="text-muted-foreground">
            Manage your customer base and their profiles
          </p>
        </div>
        <AddCustomerDialog />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">Registered customers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeCustomers}</div>
            <p className="text-xs text-muted-foreground">Active customers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified</CardTitle>
            <UserCheck className="h-4 w-4 text-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.verifiedCustomers}</div>
            <p className="text-xs text-muted-foreground">Verified profiles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Business</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.businessCustomers}</div>
            <p className="text-xs text-muted-foreground">Business accounts</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button
          variant="outline"
          className="w-full sm:w-auto"
          onClick={() => {
            setSearchQuery('');
            setPage(1);
          }}
          disabled={!searchQuery}
        >
          <Filter className="h-4 w-4" />
          Clear
        </Button>
      </div>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : isError ? (
            <div className="rounded-md bg-destructive/10 p-4 text-center">
              <p className="text-sm text-destructive">
                {error?.message || 'Failed to load customers. Please try again.'}
              </p>
            </div>
          ) : customers.length === 0 ? (
            <div className="py-12 text-center">
              <Users className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No customers found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {searchQuery
                  ? 'Try adjusting your search query'
                  : 'Get started by adding your first customer'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead className="hidden md:table-cell">Contact</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead className="hidden lg:table-cell">Orders</TableHead>
                    <TableHead className="hidden xl:table-cell">Total Spent</TableHead>
                    <TableHead className="hidden sm:table-cell">Loyalty Points</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer: ApiCustomer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <div className="font-medium">{customer.user?.fullName || customer.fullName}</div>
                            {customer.isVerified && (
                              <UserCheck className="h-3 w-3 text-info" />
                            )}
                            {customer.isBusinessCustomer && (
                              <Building2 className="h-3 w-3 text-muted-foreground" />
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {customer.customerCode}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span className="truncate max-w-[150px]">{customer.user?.email || customer.email}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {customer.user?.phoneNumber || customer.phoneNumber}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <CustomerTierBadge tier={customer.tier} />
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="space-y-1">
                          <div className="font-medium">{customer.totalOrders}</div>
                          <div className="text-xs text-muted-foreground">
                            {customer.completedOrders} completed
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">
                        <div className="space-y-1">
                          <div className="font-medium">₹{customer.totalSpent.toFixed(2)}</div>
                          {customer.averageOrderValue !== undefined && customer.averageOrderValue > 0 && (
                            <div className="text-xs text-muted-foreground">
                              Avg: ₹{customer.averageOrderValue.toFixed(2)}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="space-y-1">
                          <div className="font-medium">{customer.loyaltyPoints}</div>
                          <div className="text-xs text-muted-foreground">
                            Lifetime: {customer.lifetimePoints}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(customer.status, !!customer.isBlacklisted)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => router.push(`/admin/customers?profile=${customer.id}`)}>
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/admin/customers?edit=${customer.id}`)}>
                              Edit Customer
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/admin/orders?customer=${customer.id}`)}>
                              View Orders
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {customer.isBlacklisted ? (
                              <DropdownMenuItem
                                className="text-success"
                                onClick={() =>
                                  updateStatusMutation.mutate(
                                    { id: customer.id, status: 'ACTIVE' },
                                    {
                                      onSuccess: () => toast.success('Customer removed from blacklist'),
                                      onError: () => toast.error('Failed to remove from blacklist'),
                                    }
                                  )
                                }
                              >
                                Remove from Blacklist
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() =>
                                  updateStatusMutation.mutate(
                                    { id: customer.id, status: 'BLACKLISTED' },
                                    {
                                      onSuccess: () => toast.success('Customer added to blacklist'),
                                      onError: () => toast.error('Failed to add to blacklist'),
                                    }
                                  )
                                }
                              >
                                Add to Blacklist
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between border-t pt-4">
              <div className="text-sm text-muted-foreground">
                Page {page} of {pagination.totalPages} ({pagination.total} total)
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={page === pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
