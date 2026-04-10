'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Plus, 
  Eye, 
  Pencil, 
  Trash2, 
  CheckCircle,
  XCircle,
  DollarSign,
  Receipt,
} from 'lucide-react';
import { 
  useExpenses, 
  useDeleteExpense,
  useApproveExpense,
  useRejectExpense,
  useMarkAsPaid,
} from '@/lib/hooks/use-expenses';
import { ExpenseFiltersComponent } from '@/components/expenses/expense-filters';
import { ExpenseStatusBadge } from '@/components/expenses/expense-status-badge';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { EXPENSE_CATEGORY_LABELS } from '@/lib/constants/expense';
import type { ExpenseFilters } from '@/lib/types/expense';
import { PaymentMethod } from '@/lib/types/expense';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function ExpenseListPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<ExpenseFilters>({
    page: 1,
    limit: 10,
    sortBy: 'expenseDate',
    sortOrder: 'desc',
  });
  
  const [rejectDialog, setRejectDialog] = useState<{
    open: boolean;
    expenseId: string | null;
    reason: string;
  }>({ open: false, expenseId: null, reason: '' });

  const { data, isLoading } = useExpenses(filters);
  const deleteExpense = useDeleteExpense();
  const approveExpense = useApproveExpense();
  const rejectExpense = useRejectExpense();
  const markAsPaid = useMarkAsPaid();

  const expenses = data?.data?.expenses || [];
  const pagination = data?.data?.pagination;

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this expense? This action cannot be undone.')) {
      await deleteExpense.mutateAsync(id);
    }
  };

  const handleApprove = async (id: string) => {
    if (confirm('Are you sure you want to approve this expense?')) {
      await approveExpense.mutateAsync(id);
    }
  };

  const handleReject = async () => {
    if (rejectDialog.expenseId && rejectDialog.reason.trim().length >= 10) {
      await rejectExpense.mutateAsync({
        id: rejectDialog.expenseId,
        data: { rejectionReason: rejectDialog.reason },
      });
      setRejectDialog({ open: false, expenseId: null, reason: '' });
    }
  };

  const handleMarkPaid = async (id: string) => {
    if (confirm('Mark this expense as paid?')) {
      await markAsPaid.mutateAsync({
        id,
        data: {
          paymentMethod: PaymentMethod.BANK_TRANSFER,
          paymentDate: new Date().toISOString().split('T')[0],
        },
      });
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
          <h1 className="text-3xl font-bold tracking-tight">All Expenses</h1>
          <p className="text-muted-foreground mt-1">
            View and manage all business expenses
          </p>
        </div>
        <Button onClick={() => router.push('/admin/expenses/new')}>
          <Plus className="h-4 w-4 mr-2" />
          Add Expense
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <ExpenseFiltersComponent filters={filters} onFiltersChange={setFilters} />
        </CardContent>
      </Card>

      {/* Expenses Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Expenses ({pagination?.total || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16" />
              ))}
            </div>
          ) : expenses.length === 0 ? (
            <div className="text-center py-12">
              <Receipt className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No expenses found</h3>
              <p className="text-muted-foreground mb-4">
                Get started by adding your first expense
              </p>
              <Button onClick={() => router.push('/admin/expenses/new')}>
                <Plus className="h-4 w-4 mr-2" />
                Add Expense
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Expense #</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Approval</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell className="font-medium">
                          {expense.expenseNumber}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{expense.title}</div>
                            {expense.vendorName && (
                              <div className="text-sm text-muted-foreground">
                                {expense.vendorName}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {EXPENSE_CATEGORY_LABELS[expense.category]}
                        </TableCell>
                        <TableCell className="font-semibold">
                          {formatCurrency(expense.totalAmount)}
                        </TableCell>
                        <TableCell>
                          <ExpenseStatusBadge
                            status={expense.paymentStatus}
                            type="payment"
                          />
                        </TableCell>
                        <TableCell>
                          <ExpenseStatusBadge
                            status={expense.approvalStatus}
                            type="approval"
                          />
                        </TableCell>
                        <TableCell>{formatDate(expense.expenseDate)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/admin/expenses/${expense.id}`)}
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/admin/expenses/${expense.id}/edit`)}
                              title="Edit"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            {expense.approvalStatus === 'PENDING' && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleApprove(expense.id)}
                                  title="Approve"
                                  disabled={approveExpense.isPending}
                                >
                                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    setRejectDialog({
                                      open: true,
                                      expenseId: expense.id,
                                      reason: '',
                                    })
                                  }
                                  title="Reject"
                                >
                                  <XCircle className="h-4 w-4 text-destructive" />
                                </Button>
                              </>
                            )}
                            {expense.paymentStatus === 'UNPAID' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleMarkPaid(expense.id)}
                                title="Mark as Paid"
                                disabled={markAsPaid.isPending}
                              >
                                <DollarSign className="h-4 w-4 text-emerald-500" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(expense.id)}
                              disabled={deleteExpense.isPending}
                              title="Delete"
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

      {/* Reject Dialog */}
      <Dialog open={rejectDialog.open} onOpenChange={(open) => 
        setRejectDialog({ ...rejectDialog, open })
      }>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Expense</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this expense. This will be visible to the submitter.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Rejection Reason</Label>
              <Textarea
                id="reason"
                placeholder="Explain why this expense is being rejected..."
                value={rejectDialog.reason}
                onChange={(e) =>
                  setRejectDialog({ ...rejectDialog, reason: e.target.value })
                }
                className="min-h-[100px]"
              />
              {rejectDialog.reason.length > 0 && rejectDialog.reason.length < 10 && (
                <p className="text-sm text-destructive">
                  Reason must be at least 10 characters
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectDialog({ open: false, expenseId: null, reason: '' })}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={
                rejectDialog.reason.trim().length < 10 || rejectExpense.isPending
              }
            >
              Reject Expense
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}