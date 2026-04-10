'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  DollarSign 
} from 'lucide-react';
import { Expense, ApprovalStatus, PaymentStatus } from '@/lib/types/expense';
import {
  EXPENSE_CATEGORY_LABELS,
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_VARIANTS,
  APPROVAL_STATUS_LABELS,
  APPROVAL_STATUS_VARIANTS,
} from '@/lib/constants/expense';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

interface ExpenseTableProps {
  expenses?: Expense[];
  isLoading?: boolean;
  onView?: (expense: Expense) => void;
  onEdit?: (expense: Expense) => void;
  onDelete?: (expense: Expense) => void;
  onApprove?: (expense: Expense) => void;
  onReject?: (expense: Expense) => void;
  onMarkPaid?: (expense: Expense) => void;
}

export function ExpenseTable({
  expenses = [],
  isLoading,
  onView,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  onMarkPaid,
}: ExpenseTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Expense #</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Payment Status</TableHead>
              <TableHead>Approval Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: 8 }).map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-5 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (!expenses.length) {
    return (
      <div className="rounded-lg border bg-card p-12 text-center">
        <p className="text-muted-foreground">No expenses found</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Expense #</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Payment Status</TableHead>
            <TableHead>Approval Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.map((expense) => (
            <TableRow key={expense.id} className="hover:bg-muted/50">
              <TableCell className="font-mono text-sm">
                {expense.expenseNumber}
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{expense.title}</p>
                  {expense.vendorName && (
                    <p className="text-xs text-muted-foreground">
                      {expense.vendorName}
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm">
                  {EXPENSE_CATEGORY_LABELS[expense.category]}
                </span>
              </TableCell>
              <TableCell className="text-right font-semibold">
                ₹{expense.totalAmount.toLocaleString('en-IN')}
              </TableCell>
              <TableCell>
                <Badge variant={PAYMENT_STATUS_VARIANTS[expense.paymentStatus]}>
                  {PAYMENT_STATUS_LABELS[expense.paymentStatus]}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={APPROVAL_STATUS_VARIANTS[expense.approvalStatus]}>
                  {APPROVAL_STATUS_LABELS[expense.approvalStatus]}
                </Badge>
              </TableCell>
              <TableCell>
                {format(new Date(expense.expenseDate), 'dd MMM yyyy')}
              </TableCell>
              <TableCell className="text-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {onView && (
                      <DropdownMenuItem onClick={() => onView(expense)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                    )}
                    {onEdit && (
                      <DropdownMenuItem onClick={() => onEdit(expense)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                    )}
                    
                    {expense.approvalStatus === ApprovalStatus.PENDING && (
                      <>
                        <DropdownMenuSeparator />
                        {onApprove && (
                          <DropdownMenuItem onClick={() => onApprove(expense)}>
                            <CheckCircle className="mr-2 h-4 w-4 text-success" />
                            Approve
                          </DropdownMenuItem>
                        )}
                        {onReject && (
                          <DropdownMenuItem onClick={() => onReject(expense)}>
                            <XCircle className="mr-2 h-4 w-4 text-destructive" />
                            Reject
                          </DropdownMenuItem>
                        )}
                      </>
                    )}
                    
                    {expense.paymentStatus === PaymentStatus.UNPAID && onMarkPaid && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onMarkPaid(expense)}>
                          <DollarSign className="mr-2 h-4 w-4 text-success" />
                          Mark as Paid
                        </DropdownMenuItem>
                      </>
                    )}
                    
                    {onDelete && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => onDelete(expense)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
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
  );
}