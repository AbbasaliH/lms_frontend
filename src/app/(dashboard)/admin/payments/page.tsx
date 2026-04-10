'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Filter,
  Download,
  Loader2,
  Eye,
  Receipt,
  RefreshCcw,
  MoreVertical,
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
import { usePayments, usePaymentStats, useRefundPayment } from '@/lib/hooks/use-payments';
import { PaymentStats } from '@/components/payments/payment-stats';
import { PaymentDetailDialog } from '@/components/payments/payment-detail-dialog';
import { RefundPaymentDialog } from '@/components/payments/refund-payment-dialog';
import { format, formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import type { ApiPayment, PaymentStatus, PaymentMethod } from '@/lib/types/payment';
import { cn } from '@/lib/utils';

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20';
    case 'pending':
      return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20';
    case 'processing':
      return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20';
    case 'failed':
      return 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20';
    case 'refunded':
      return 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20';
    case 'cancelled':
      return 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20';
    default:
      return 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20';
  }
};

const getMethodColor = (method: string) => {
  switch (method.toLowerCase()) {
    case 'card':
      return 'bg-blue-500/10 text-blue-700 dark:text-blue-400';
    case 'upi':
      return 'bg-green-500/10 text-green-700 dark:text-green-400';
    case 'cash':
      return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
    case 'wallet':
      return 'bg-purple-500/10 text-purple-700 dark:text-purple-400';
    default:
      return 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
  }
};

const statusTabs = [
  { value: 'all', label: 'All Payments' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'PROCESSING', label: 'Processing' },
  { value: 'FAILED', label: 'Failed' },
  { value: 'REFUNDED', label: 'Refunded' },
];

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'all'>('all');
  const [methodFilter, setMethodFilter] = useState<PaymentMethod | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Dialog states
  const [selectedPayment, setSelectedPayment] = useState<ApiPayment | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [refundDialogOpen, setRefundDialogOpen] = useState(false);

  // Fetch payments and stats
  const { data: statsData, isLoading: statsLoading } = usePaymentStats();
  const {
    data: paymentsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['payments', { page: currentPage, limit: pageSize }],
    queryFn: async () => {
      // Mock data for now - replace with actual API call
      return {
        success: true,
        data: {
          payments: [] as ApiPayment[],
          pagination: {
            total: 0,
            page: currentPage,
            limit: pageSize,
            totalPages: 0,
          },
        },
      };
    },
  });

  const payments = paymentsData?.data.payments || [];
  const pagination = paymentsData?.data.pagination;

  // Filter payments
  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.transactionId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || payment.paymentMethod === methodFilter;
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const refundMutation = useRefundPayment();

  // Action handlers
  const handleViewDetails = (payment: ApiPayment) => {
    setSelectedPayment(payment);
    setViewDialogOpen(true);
  };

  const handleRefund = (payment: ApiPayment) => {
    setSelectedPayment(payment);
    setRefundDialogOpen(true);
  };

  const handleDownloadReceipt = (payment: ApiPayment) => {
    toast.info('Downloading receipt...');
    // TODO: Implement receipt download
  };

  const handleExport = () => {
    const csvContent = [
      [
        'Payment ID',
        'Transaction ID',
        'Customer',
        'Email',
        'Amount',
        'Method',
        'Status',
        'Type',
        'Date',
      ].join(','),
      ...filteredPayments.map((payment) =>
        [
          payment.id,
          payment.transactionId || 'N/A',
          payment.user.fullName,
          payment.user.email,
          payment.amount.toFixed(2),
          payment.paymentMethod,
          payment.status,
          payment.type,
          format(new Date(payment.createdAt), 'yyyy-MM-dd HH:mm'),
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payments-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Payments exported successfully');
  };

  const onRefundSubmit = async (paymentId: string, amount: number, reason: string) => {
    await refundMutation.mutateAsync({ paymentId, amount, reason });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Payments</h2>
          <p className="text-muted-foreground">Track and manage all payment transactions</p>
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
        </div>
      </div>

      {/* Stats */}
      {!statsLoading && <PaymentStats stats={statsData?.data} />}

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="space-y-4">
            {/* Status Tabs */}
            <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
              <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
                {statusTabs.map((tab) => (
                  <TabsTrigger key={tab.value} value={tab.value} className="text-xs sm:text-sm">
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by customer, email, payment ID, or transaction ID..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10"
                />
              </div>
              <Select
                value={methodFilter}
                onValueChange={(value) => {
                  setMethodFilter(value as any);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Payment Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="CASH">Cash</SelectItem>
                  <SelectItem value="CARD">Card</SelectItem>
                  <SelectItem value="UPI">UPI</SelectItem>
                  <SelectItem value="WALLET">Wallet</SelectItem>
                  <SelectItem value="NET_BANKING">Net Banking</SelectItem>
                  <SelectItem value="CREDIT">Credit</SelectItem>
                </SelectContent>
              </Select>
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
              <span className="ml-2 text-muted-foreground">Loading payments...</span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-destructive mb-4">Failed to load payments</p>
              <Button onClick={() => refetch()} variant="outline">
                Try Again
              </Button>
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-2">No payments found</p>
              <p className="text-sm text-muted-foreground">
                {searchQuery || statusFilter !== 'all' || methodFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Payments will appear here once customers make transactions'}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Payment ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.map((payment) => (
                      <TableRow
                        key={payment.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleViewDetails(payment)}
                      >
                        <TableCell className="font-mono text-xs font-medium">
                          #{payment.id.slice(0, 8)}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{payment.user.fullName}</span>
                            <span className="text-xs text-muted-foreground">
                              {payment.user.email}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold">
                          ${payment.amount.toFixed(2)}
                          {payment.refundAmount > 0 && (
                            <span className="block text-xs text-destructive">
                              Refunded: ${payment.refundAmount.toFixed(2)}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className={getMethodColor(payment.paymentMethod)}>
                            {payment.paymentMethod}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{payment.type}</Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          <div className="flex flex-col">
                            <span>{format(new Date(payment.createdAt), 'MMM dd, yyyy')}</span>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(payment.createdAt), {
                                addSuffix: true,
                              })}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={cn('border', getStatusColor(payment.status))}>
                            {payment.status}
                          </Badge>
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewDetails(payment)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDownloadReceipt(payment)}>
                                <Receipt className="mr-2 h-4 w-4" />
                                Download Receipt
                              </DropdownMenuItem>
                              {payment.status === 'COMPLETED' &&
                                payment.amount > payment.refundAmount && (
                                  <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      className="text-destructive focus:text-destructive"
                                      onClick={() => handleRefund(payment)}
                                    >
                                      <RefreshCcw className="mr-2 h-4 w-4" />
                                      Process Refund
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
                {filteredPayments.map((payment) => (
                  <Card
                    key={payment.id}
                    className="overflow-hidden cursor-pointer"
                    onClick={() => handleViewDetails(payment)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-mono text-muted-foreground">
                            #{payment.id.slice(0, 8)}
                          </p>
                          <h3 className="font-semibold">{payment.user.fullName}</h3>
                          <p className="text-sm text-muted-foreground">{payment.user.email}</p>
                        </div>
                        <Badge className={cn('border', getStatusColor(payment.status))}>
                          {payment.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Amount:</span>
                        <span className="font-bold">${payment.amount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Method:</span>
                        <Badge className={getMethodColor(payment.paymentMethod)}>
                          {payment.paymentMethod}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Type:</span>
                        <Badge variant="outline">{payment.type}</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Date:</span>
                        <span className="font-medium">
                          {format(new Date(payment.createdAt), 'MMM dd, yyyy')}
                        </span>
                      </div>
                      <div className="flex gap-2 pt-2 border-t" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleViewDetails(payment)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        {payment.status === 'COMPLETED' &&
                          payment.amount > payment.refundAmount && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={() => handleRefund(payment)}
                            >
                              <RefreshCcw className="h-4 w-4 mr-2" />
                              Refund
                            </Button>
                          )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * pageSize + 1} to{' '}
                    {Math.min(currentPage * pageSize, pagination.total)} of {pagination.total}{' '}
                    payments
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
                      onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
                      disabled={currentPage === pagination.totalPages}
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
      <PaymentDetailDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        payment={selectedPayment}
      />

      <RefundPaymentDialog
        open={refundDialogOpen}
        onOpenChange={setRefundDialogOpen}
        payment={selectedPayment}
        onSubmit={onRefundSubmit}
      />
    </div>
  );
}
