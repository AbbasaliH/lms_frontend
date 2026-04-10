'use client';

import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  Pencil,
  Trash2,
  CheckCircle,
  XCircle,
  DollarSign,
  Download,
  FileText,
  Building2,
  TrendingUp,
} from 'lucide-react';
import {
  useExpense,
  useDeleteExpense,
  useApproveExpense,
  useRejectExpense,
  useMarkAsPaid,
} from '@/lib/hooks/use-expenses';
import { ExpenseStatusBadge } from '@/components/expenses/expense-status-badge';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils/format';
import {
  EXPENSE_CATEGORY_LABELS,
  PAYMENT_METHOD_LABELS,
  RECURRENCE_TYPE_LABELS,
} from '@/lib/constants/expense';
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
import { useState } from 'react';

export default function ExpenseDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const expenseId = params.id as string;

  const [rejectDialog, setRejectDialog] = useState({
    open: false,
    reason: '',
  });

  const { data, isLoading } = useExpense(expenseId);
  const deleteExpense = useDeleteExpense();
  const approveExpense = useApproveExpense();
  const rejectExpense = useRejectExpense();
  const markAsPaid = useMarkAsPaid();

  const expense = data?.data;

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this expense? This action cannot be undone.')) {
      await deleteExpense.mutateAsync(expenseId);
      router.push('/admin/expenses/list');
    }
  };

  const handleApprove = async () => {
    if (confirm('Are you sure you want to approve this expense?')) {
      await approveExpense.mutateAsync(expenseId);
    }
  };

  const handleReject = async () => {
    if (rejectDialog.reason.trim().length >= 10) {
      await rejectExpense.mutateAsync({
        id: expenseId,
        data: { rejectionReason: rejectDialog.reason },
      });
      setRejectDialog({ open: false, reason: '' });
    }
  };

  const handleMarkPaid = async () => {
    if (confirm('Mark this expense as paid?')) {
      await markAsPaid.mutateAsync({
        id: expenseId,
        data: {
          paymentMethod: PaymentMethod.BANK_TRANSFER,
          paymentDate: new Date().toISOString().split('T')[0],
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-[300px]" />
          <Skeleton className="h-[300px]" />
        </div>
      </div>
    );
  }

  if (!expense) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Expense not found</h2>
        <p className="text-muted-foreground mt-2">
          The expense you're looking for doesn't exist
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold tracking-tight">{expense.title}</h1>
          <div className="flex gap-2">
            <ExpenseStatusBadge status={expense.paymentStatus} type="payment" />
            <ExpenseStatusBadge status={expense.approvalStatus} type="approval" />
          </div>
        </div>
        <p className="text-muted-foreground">
          Expense #{expense.expenseNumber} • Created {formatDateTime(expense.createdAt)}
        </p>
      </div>

      {/* Action Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2">
            <Button
              variant="default"
              onClick={() => router.push(`/admin/expenses/${expenseId}/edit`)}
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>

            {expense.approvalStatus === 'PENDING' && (
              <>
                <Button
                  variant="outline"
                  onClick={handleApprove}
                  disabled={approveExpense.isPending}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setRejectDialog({ open: true, reason: '' })}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </>
            )}

            {expense.paymentStatus === 'UNPAID' && (
              <Button
                variant="outline"
                onClick={handleMarkPaid}
                disabled={markAsPaid.isPending}
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Mark as Paid
              </Button>
            )}

            {expense.receiptUrl && (
              <Button variant="outline" asChild>
                <a href={expense.receiptUrl} target="_blank" rel="noopener noreferrer">
                  <Download className="h-4 w-4 mr-2" />
                  Receipt
                </a>
              </Button>
            )}

            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteExpense.isPending}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Expense Details */}
        <Card>
          <CardHeader>
            <CardTitle>Expense Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground">Category</div>
              <div className="font-medium">{EXPENSE_CATEGORY_LABELS[expense.category]}</div>
              {expense.subCategory && (
                <div className="text-sm text-muted-foreground">{expense.subCategory}</div>
              )}
            </div>

            {expense.description && (
              <>
                <Separator />
                <div>
                  <div className="text-sm text-muted-foreground">Description</div>
                  <div className="mt-1">{expense.description}</div>
                </div>
              </>
            )}

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Expense Date</div>
                <div className="font-medium">{formatDate(expense.expenseDate)}</div>
              </div>

              {expense.dueDate && (
                <div>
                  <div className="text-sm text-muted-foreground">Due Date</div>
                  <div className="font-medium">{formatDate(expense.dueDate)}</div>
                </div>
              )}
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Created By</div>
                <div className="font-medium">{expense.createdBy}</div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground">Created At</div>
                <div className="font-medium">{formatDateTime(expense.createdAt)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Information */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-medium">{formatCurrency(expense.amount)}</span>
              </div>
              {expense.taxAmount && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax Amount</span>
                  <span className="font-medium">{formatCurrency(expense.taxAmount)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-lg">
                <span className="font-semibold">Total Amount</span>
                <span className="font-bold">{formatCurrency(expense.totalAmount)}</span>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Payment Status</div>
                <div className="mt-1">
                  <ExpenseStatusBadge status={expense.paymentStatus} type="payment" />
                </div>
              </div>

              {expense.paymentMethod && (
                <div>
                  <div className="text-sm text-muted-foreground">Payment Method</div>
                  <div className="font-medium mt-1">
                    {PAYMENT_METHOD_LABELS[expense.paymentMethod]}
                  </div>
                </div>
              )}
            </div>

            {expense.paymentDate && (
              <>
                <Separator />
                <div>
                  <div className="text-sm text-muted-foreground">Payment Date</div>
                  <div className="font-medium">{formatDate(expense.paymentDate)}</div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Vendor Information */}
        {(expense.vendorName || expense.invoiceNumber) && (
          <Card>
            <CardHeader>
              <CardTitle>Vendor Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {expense.vendorName && (
                <div>
                  <div className="text-sm text-muted-foreground">Vendor Name</div>
                  <div className="font-medium">{expense.vendorName}</div>
                </div>
              )}

              {expense.vendorContact && (
                <>
                  <Separator />
                  <div>
                    <div className="text-sm text-muted-foreground">Contact</div>
                    <div className="font-medium">{expense.vendorContact}</div>
                  </div>
                </>
              )}

              {expense.invoiceNumber && (
                <>
                  <Separator />
                  <div>
                    <div className="text-sm text-muted-foreground">Invoice Number</div>
                    <div className="font-medium">{expense.invoiceNumber}</div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Organization */}
        {(expense.department || expense.budget) && (
          <Card>
            <CardHeader>
              <CardTitle>Organization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {expense.department && (
                <div className="flex items-start gap-3">
                  <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="text-sm text-muted-foreground">Department</div>
                    <div className="font-medium">{expense.department.name}</div>
                  </div>
                </div>
              )}

              {expense.budget && (
                <>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm text-muted-foreground">Budget</div>
                      <div className="font-medium">{expense.budget.name}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {formatCurrency(expense.budget.spentAmount)} /{' '}
                        {formatCurrency(expense.budget.allocatedAmount)} used
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recurring Information */}
      {expense.isRecurring && (
        <Card>
          <CardHeader>
            <CardTitle>Recurring Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div>
              <div className="text-sm text-muted-foreground">Recurrence Type</div>
              <div className="font-medium">
                {expense.recurrenceType ? RECURRENCE_TYPE_LABELS[expense.recurrenceType] : 'N/A'}
              </div>
            </div>

            <div>
              <div className="text-sm text-muted-foreground">Recurrence Interval</div>
              <div className="font-medium">{expense.recurrenceInterval || 'N/A'}</div>
            </div>

            {expense.nextRecurrenceDate && (
              <div>
                <div className="text-sm text-muted-foreground">Next Recurrence</div>
                <div className="font-medium">{formatDate(expense.nextRecurrenceDate)}</div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Additional Information */}
      {expense.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Additional Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{expense.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Approval Information */}
      {(expense.approvedBy || expense.rejectedBy) && (
        <Card>
          <CardHeader>
            <CardTitle>Approval Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <div className="text-sm text-muted-foreground">Status</div>
                <div className="mt-1">
                  <ExpenseStatusBadge status={expense.approvalStatus} type="approval" />
                </div>
              </div>

              {expense.approvedBy && (
                <>
                  <div>
                    <div className="text-sm text-muted-foreground">Approved By</div>
                    <div className="font-medium">{expense.approvedBy}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Approved At</div>
                    <div className="font-medium">
                      {expense.approvedAt ? formatDateTime(expense.approvedAt) : 'N/A'}
                    </div>
                  </div>
                </>
              )}

              {expense.rejectedBy && (
                <>
                  <div>
                    <div className="text-sm text-muted-foreground">Rejected By</div>
                    <div className="font-medium">{expense.rejectedBy}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Rejected At</div>
                    <div className="font-medium">
                      {expense.rejectedAt ? formatDateTime(expense.rejectedAt) : 'N/A'}
                    </div>
                  </div>
                </>
              )}
            </div>

            {expense.rejectionReason && (
              <>
                <Separator />
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Rejection Reason</div>
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    {expense.rejectionReason}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Reject Dialog */}
      <Dialog open={rejectDialog.open} onOpenChange={(open) => setRejectDialog({ ...rejectDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Expense</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this expense.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Rejection Reason</Label>
              <Textarea
                id="reason"
                placeholder="Explain why this expense is being rejected..."
                value={rejectDialog.reason}
                onChange={(e) => setRejectDialog({ ...rejectDialog, reason: e.target.value })}
                className="min-h-[100px]"
              />
              {rejectDialog.reason.length > 0 && rejectDialog.reason.length < 10 && (
                <p className="text-sm text-destructive">Reason must be at least 10 characters</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectDialog({ open: false, reason: '' })}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={rejectDialog.reason.trim().length < 10 || rejectExpense.isPending}
            >
              Reject Expense
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}