'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ordersApi } from '@/lib/api/orders';
import {
  Search,
  Plus,
  Filter,
  MoreVertical,
  Loader2,
  Eye,
  Edit,
  Printer,
  XCircle,
  Truck,
  Download,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CreateOrderDialog } from '@/components/orders/create-order-dialog';
import { OrderDetailDialog } from '@/components/orders/order-detail-dialog';
import { UpdateStatusDialog } from '@/components/orders/update-status-dialog';
import { CancelOrderDialog } from '@/components/orders/cancel-order-dialog';
import { AssignDeliveryBoyDialog } from '@/components/orders/assign-delivery-boy-dialog';
import { OrderStats } from '@/components/orders/order-stats';
import { format, formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import type { ApiOrder } from '@/lib/types/api';
import { cn } from '@/lib/utils';

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20';
    case 'processing':
      return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20';
    case 'ready':
      return 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20';
    case 'delivered':
      return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20';
    case 'cancelled':
      return 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20';
    default:
      return 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20';
  }
};

const statusTabs = [
  { value: 'all', label: 'All Orders' },
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'ready', label: 'Ready' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const queryClient = useQueryClient();

  // Dialog states
  const [selectedOrder, setSelectedOrder] = useState<ApiOrder | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);

  // Fetch orders from API with filters
  const { data: ordersData, isLoading, error, refetch } = useQuery({
    queryKey: ['orders', searchQuery, statusFilter, currentPage, pageSize],
    queryFn: () => ordersApi.getOrders({
      search: searchQuery || undefined,
      status: statusFilter !== 'all' ? statusFilter : undefined,
      page: currentPage,
      limit: pageSize,
    }),
  });

  const orders = ordersData?.data || [];
  // Use API pagination if available, otherwise fall back to client-side
  const apiPagination = (ordersData as any)?.data?.pagination;
  const totalOrders = apiPagination?.total ?? orders.length;
  const totalPages = apiPagination?.totalPages ?? Math.ceil(orders.length / pageSize);
  const paginatedOrders = apiPagination ? orders : orders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Mutations
  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) =>
      ordersApi.updateOrderStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Order status updated successfully');
    },
    onError: () => {
      toast.error('Failed to update order status');
    },
  });

  const cancelOrderMutation = useMutation({
    mutationFn: ({ orderId, reason }: { orderId: string; reason?: string }) =>
      ordersApi.cancelOrder(orderId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Order cancelled successfully');
    },
    onError: () => {
      toast.error('Failed to cancel order');
    },
  });

  const assignDeliveryBoyMutation = useMutation({
    mutationFn: ({ orderId, deliveryBoyId }: { orderId: string; deliveryBoyId: string }) =>
      ordersApi.assignDeliveryBoy(orderId, deliveryBoyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Delivery person assigned successfully');
    },
    onError: () => {
      toast.error('Failed to assign delivery person');
    },
  });

  // Action handlers
  const handleViewDetails = (order: ApiOrder) => {
    setSelectedOrder(order);
    setViewDialogOpen(true);
  };

  const handleUpdateStatus = (order: ApiOrder) => {
    setSelectedOrder(order);
    setStatusDialogOpen(true);
  };

  const handleCancelOrder = (order: ApiOrder) => {
    setSelectedOrder(order);
    setCancelDialogOpen(true);
  };

  const handleAssignDeliveryBoy = (order: ApiOrder) => {
    setSelectedOrder(order);
    setAssignDialogOpen(true);
  };

  const handlePrintInvoice = (order: ApiOrder) => {
    // Create a printable invoice
    const invoiceContent = `
      <html>
        <head>
          <title>Invoice - ${order.id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .details { margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Order Invoice</h1>
            <p>Order ID: #${order.id}</p>
          </div>
          <div class="details">
            <h3>Customer Information</h3>
            <p>Name: ${order.user.fullName}</p>
            <p>Phone: ${order.user.phoneNumber}</p>
            <p>Date: ${format(new Date(order.createdAt), 'MMM dd, yyyy hh:mm a')}</p>
          </div>
          <div class="details">
            <h3>Order Details</h3>
            <table>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Amount</th>
              </tr>
              <tr>
                <td>${order.product.name}</td>
                <td>${order.product.category}</td>
                <td>$${order.totalAmount.toFixed(2)}</td>
              </tr>
            </table>
          </div>
          <div class="details">
            <h3>Total Amount: $${order.totalAmount.toFixed(2)}</h3>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(invoiceContent);
      printWindow.document.close();
      printWindow.print();
    } else {
      toast.error('Failed to open print window');
    }
  };

  const handleExport = () => {
    const csvContent = [
      ['Order ID', 'Customer', 'Phone', 'Product', 'Status', 'Amount', 'Date'].join(','),
      ...orders.map((order: ApiOrder) =>
        [
          order.id,
          order.user.fullName,
          order.user.phoneNumber,
          order.product.name,
          order.status,
          order.totalAmount.toFixed(2),
          format(new Date(order.createdAt), 'yyyy-MM-dd'),
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Orders exported successfully');
  };

  const onStatusUpdate = async (orderId: string, status: string) => {
    await updateStatusMutation.mutateAsync({ orderId, status });
  };

  const onOrderCancel = async (orderId: string, reason?: string) => {
    await cancelOrderMutation.mutateAsync({ orderId, reason });
  };

  const onDeliveryBoyAssign = async (orderId: string, deliveryBoyId: string) => {
    await assignDeliveryBoyMutation.mutateAsync({ orderId, deliveryBoyId });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Orders Management</h2>
          <p className="text-muted-foreground">
            Manage and track all customer orders
          </p>
        </div>
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={handleExport}>
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Export to CSV</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <CreateOrderDialog onSuccess={refetch}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Order
            </Button>
          </CreateOrderDialog>
        </div>
      </div>

      {/* Stats */}
      {!isLoading && <OrderStats orders={orders} />}

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="space-y-4">
            {/* Status Tabs */}
            <Tabs value={statusFilter} onValueChange={setStatusFilter}>
              <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
                {statusTabs.map((tab) => (
                  <TabsTrigger key={tab.value} value={tab.value} className="text-xs sm:text-sm">
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            {/* Search */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by customer, order ID, or product..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10"
                />
              </div>
              <Select
                value={pageSize.toString()}
                onValueChange={(value) => {
                  setPageSize(Number(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 per page</SelectItem>
                  <SelectItem value="10">10 per page</SelectItem>
                  <SelectItem value="20">20 per page</SelectItem>
                  <SelectItem value="50">50 per page</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading orders...</span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-destructive mb-4">Failed to load orders</p>
              <Button onClick={() => refetch()} variant="outline">
                Try Again
              </Button>
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-2">No orders found</p>
              <p className="text-sm text-muted-foreground">
                {searchQuery || statusFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Create your first order to get started'}
              </p>
              {(searchQuery || statusFilter !== 'all') && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                    setCurrentPage(1);
                  }}
                  className="mt-2"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Delivery</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedOrders.map((order) => (
                      <TableRow key={order.id} className="cursor-pointer hover:bg-muted/50">
                        <TableCell className="font-mono text-xs font-medium">
                          #{order.id.slice(0, 8)}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{order.user.fullName}</span>
                            <span className="text-xs text-muted-foreground">
                              {order.user.phoneNumber}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{order.product.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {order.product.category}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {order.deliveryBoy ? (
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">
                                {order.deliveryBoy.fullName}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {order.deliveryBoy.phoneNumber}
                              </span>
                            </div>
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              Unassigned
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-sm">
                          <div className="flex flex-col">
                            <span>{format(new Date(order.createdAt), 'MMM dd, yyyy')}</span>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={cn('border', getStatusColor(order.status))}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          ${order.totalAmount.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewDetails(order)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleUpdateStatus(order)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Update Status
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleAssignDeliveryBoy(order)}>
                                <Truck className="mr-2 h-4 w-4" />
                                {order.deliveryBoy ? 'Reassign' : 'Assign'} Delivery
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handlePrintInvoice(order)}>
                                <Printer className="mr-2 h-4 w-4" />
                                Print Invoice
                              </DropdownMenuItem>
                              {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-destructive focus:text-destructive"
                                    onClick={() => handleCancelOrder(order)}
                                  >
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Cancel Order
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {paginatedOrders.map((order) => (
                  <Card key={order.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-mono text-muted-foreground">
                            #{order.id.slice(0, 8)}
                          </p>
                          <h3 className="font-semibold">{order.user.fullName}</h3>
                          <p className="text-sm text-muted-foreground">{order.user.phoneNumber}</p>
                        </div>
                        <Badge className={cn('border', getStatusColor(order.status))}>
                          {order.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Product:</span>
                        <span className="font-medium">{order.product.name}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Delivery:</span>
                        {order.deliveryBoy ? (
                          <span className="font-medium">{order.deliveryBoy.fullName}</span>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            Unassigned
                          </Badge>
                        )}
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Date:</span>
                        <span className="font-medium">
                          {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t">
                        <span className="text-lg font-bold">${order.totalAmount.toFixed(2)}</span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MoreVertical className="h-4 w-4 mr-2" />
                              Actions
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewDetails(order)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateStatus(order)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Update Status
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAssignDeliveryBoy(order)}>
                              <Truck className="mr-2 h-4 w-4" />
                              {order.deliveryBoy ? 'Reassign' : 'Assign'} Delivery
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handlePrintInvoice(order)}>
                              <Printer className="mr-2 h-4 w-4" />
                              Print Invoice
                            </DropdownMenuItem>
                            {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => handleCancelOrder(order)}
                                >
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Cancel Order
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * pageSize + 1} to{' '}
                    {Math.min(currentPage * pageSize, totalOrders)} of{' '}
                    {totalOrders} orders
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <OrderDetailDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        order={selectedOrder}
      />

      <UpdateStatusDialog
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
        order={selectedOrder}
        onSubmit={onStatusUpdate}
      />

      <CancelOrderDialog
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        order={selectedOrder}
        onSubmit={onOrderCancel}
      />

      <AssignDeliveryBoyDialog
        open={assignDialogOpen}
        onOpenChange={setAssignDialogOpen}
        order={selectedOrder}
        onSubmit={onDeliveryBoyAssign}
      />
    </div>
  );
}
