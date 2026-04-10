'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import {
  Package,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  MoreHorizontal,
  Loader2,
  Eye,
  Download,
  Plus,
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
import { usePurchaseOrders } from '@/lib/hooks/use-suppliers';
import type { PurchaseOrderStatus, PaymentStatus } from '@/lib/types/supplier';
import { CreatePurchaseOrderDialog } from '@/components/purchase-orders/create-purchase-order-dialog';

const getStatusBadge = (status: PurchaseOrderStatus) => {
  const statusConfig: Record<PurchaseOrderStatus, { variant: 'outline' | 'default' | 'destructive'; label: string; className: string }> = {
    PENDING: { variant: 'default', label: 'Pending', className: 'bg-warning text-warning-foreground' },
    APPROVED: { variant: 'default', label: 'Approved', className: 'bg-info text-info-foreground' },
    REJECTED: { variant: 'destructive', label: 'Rejected', className: '' },
    ORDERED: { variant: 'default', label: 'Ordered', className: 'bg-blue-500 text-white' },
    PARTIALLY_RECEIVED: { variant: 'default', label: 'Partially Received', className: 'bg-purple-500 text-white' },
    RECEIVED: { variant: 'default', label: 'Received', className: 'bg-success text-success-foreground' },
    COMPLETED: { variant: 'default', label: 'Completed', className: 'bg-success text-success-foreground' },
    CANCELLED: { variant: 'destructive', label: 'Cancelled', className: '' },
  };

  const config = statusConfig[status] || statusConfig.PENDING;

  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
};

const getPaymentStatusBadge = (status: PaymentStatus) => {
  const statusConfig: Record<PaymentStatus, { variant: 'outline' | 'default' | 'destructive'; label: string; className: string }> = {
    UNPAID: { variant: 'outline', label: 'Unpaid', className: 'border-warning text-warning' },
    PARTIALLY_PAID: { variant: 'default', label: 'Partially Paid', className: 'bg-warning text-warning-foreground' },
    PAID: { variant: 'default', label: 'Paid', className: 'bg-success text-success-foreground' },
    OVERDUE: { variant: 'destructive', label: 'Overdue', className: '' },
    PENDING: { variant: 'outline', label: 'Pending', className: 'border-warning text-warning' },
    APPROVED: { variant: 'default', label: 'Approved', className: 'bg-info text-info-foreground' },
    REJECTED: { variant: 'destructive', label: 'Rejected', className: '' },
  };

  const config = statusConfig[status] || statusConfig.UNPAID;

  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
};

export default function ItemsOrdersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading, isError, error } = usePurchaseOrders({ page, limit });

  const filteredOrders = data?.data.orders?.filter((order) =>
    order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.supplier?.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.items.some(item => item.itemName.toLowerCase().includes(searchQuery.toLowerCase()))
  ) || [];

  const stats = {
    totalOrders: data?.data.pagination.total || 0,
    pendingOrders: data?.data.orders?.filter(
      (order) => order.status === 'PENDING' || order.status === 'APPROVED' || order.status === 'ORDERED'
    ).length || 0,
    deliveredOrders: data?.data.orders?.filter(
      (order) => order.status === 'RECEIVED' || order.status === 'COMPLETED'
    ).length || 0,
    totalValue: data?.data.orders?.reduce(
      (sum, order) => sum + order.grandTotal,
      0
    ) || 0,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Items Order</h2>
          <p className="text-muted-foreground">
            Track and manage supplier purchase orders
          </p>
        </div>
        <CreatePurchaseOrderDialog>
          <Button>
            <Plus className="h-4 w-4" />
            New Order
          </Button>
        </CreatePurchaseOrderDialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">All purchase orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingOrders}</div>
            <p className="text-xs text-muted-foreground">Awaiting delivery</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.deliveredOrders}</div>
            <p className="text-xs text-muted-foreground">Successfully received</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.totalValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Purchase value</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by order number, supplier, or item..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" className="w-full sm:w-auto">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Purchase Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : isError ? (
            <div className="rounded-md bg-destructive/10 p-4 text-center">
              <p className="text-sm text-destructive">
                {error?.message || 'Failed to load orders. Please try again.'}
              </p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="py-12 text-center">
              <Package className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No orders found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {searchQuery
                  ? 'Try adjusting your search query'
                  : 'Get started by creating your first purchase order'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order Number</TableHead>
                    <TableHead className="hidden md:table-cell">Supplier</TableHead>
                    <TableHead>Order Date</TableHead>
                    <TableHead className="hidden lg:table-cell">Expected Delivery</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead className="hidden xl:table-cell">Total Amount</TableHead>
                    <TableHead className="hidden sm:table-cell">Payment Status</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{order.orderNumber}</div>
                          <div className="text-xs text-muted-foreground">
                            {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="space-y-1">
                          <div className="font-medium">{order.supplier?.companyName || 'N/A'}</div>
                          {order.supplier?.contactPerson && (
                            <div className="text-xs text-muted-foreground">
                              {order.supplier.contactPerson}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {format(new Date(order.orderDate), 'MMM d, yyyy')}
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="text-sm">
                          {format(new Date(order.expectedDelivery), 'MMM d, yyyy')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[200px]">
                          {order.items.slice(0, 2).map((item, idx) => (
                            <div key={idx} className="text-sm truncate">
                              {item.itemName} ({item.quantity})
                            </div>
                          ))}
                          {order.items.length > 2 && (
                            <div className="text-xs text-muted-foreground">
                              +{order.items.length - 2} more
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">
                        <div className="font-medium">₹{order.grandTotal.toFixed(2)}</div>
                        {order.discount > 0 && (
                          <div className="text-xs text-success">
                            -₹{order.discount.toFixed(2)}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {getPaymentStatusBadge(order.paymentStatus)}
                      </TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
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
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Download Invoice
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Edit Order</DropdownMenuItem>
                            {order.status === 'PENDING' && (
                              <>
                                <DropdownMenuItem className="text-success">
                                  <CheckCircle2 className="mr-2 h-4 w-4" />
                                  Approve Order
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Reject Order
                                </DropdownMenuItem>
                              </>
                            )}
                            {order.status === 'PARTIALLY_RECEIVED' && (
                              <DropdownMenuItem className="text-success">
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Mark as Received
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
          {data && data.data.pagination.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between border-t pt-4">
              <div className="text-sm text-muted-foreground">
                Page {page} of {data.data.pagination.totalPages}
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
                  disabled={page === data.data.pagination.totalPages}
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
