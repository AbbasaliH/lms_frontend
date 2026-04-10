'use client';

import { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useDepartment } from '@/lib/hooks/use-expenses';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { EXPENSE_CATEGORY_LABELS } from '@/lib/constants/expense';
import { ExpenseStatusBadge } from '@/components/expenses/expense-status-badge';
import { Mail, Phone, User, Receipt, TrendingUp, Calendar, Pencil } from 'lucide-react';

interface DepartmentDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  departmentId: string | null;
  onEdit?: () => void;
}

export function DepartmentDetailDialog({
  open,
  onOpenChange,
  departmentId,
  onEdit,
}: DepartmentDetailDialogProps) {
  const { data, isLoading, refetch } = useDepartment(departmentId || '');

  // Refetch when dialog opens
  useEffect(() => {
    if (open && departmentId) {
      refetch();
    }
  }, [open, departmentId, refetch]);

  const department = data?.data;
  const expenses = department?.expenses || [];
  const budgets = department?.budgets || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-64" />
          </div>
        ) : department ? (
          <>
            <DialogHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <DialogTitle className="text-2xl">{department.name}</DialogTitle>
                  <DialogDescription className="mt-2">
                    {department.description || 'No description provided'}
                  </DialogDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={department.isActive ? 'default' : 'secondary'}>
                    {department.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                  {onEdit && (
                    <Button variant="outline" size="sm" onClick={onEdit}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  )}
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-6 mt-4">
              {/* Department Head Information */}
              {(department.headName || department.headEmail || department.headPhone) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Department Head
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {department.headName && (
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{department.headName}</span>
                      </div>
                    )}
                    {department.headEmail && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={`mailto:${department.headEmail}`}
                          className="text-primary hover:underline"
                        >
                          {department.headEmail}
                        </a>
                      </div>
                    )}
                    {department.headPhone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <a href={`tel:${department.headPhone}`} className="hover:underline">
                          {department.headPhone}
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center space-y-2">
                      <Receipt className="h-8 w-8 mx-auto text-muted-foreground" />
                      <div className="text-2xl font-bold">{expenses.length}</div>
                      <div className="text-sm text-muted-foreground">Expenses</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center space-y-2">
                      <TrendingUp className="h-8 w-8 mx-auto text-muted-foreground" />
                      <div className="text-2xl font-bold">{budgets.length}</div>
                      <div className="text-sm text-muted-foreground">Budgets</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center space-y-2">
                      <Calendar className="h-8 w-8 mx-auto text-muted-foreground" />
                      <div className="text-xs font-medium text-muted-foreground">Created</div>
                      <div className="text-sm">{formatDate(department.createdAt)}</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center space-y-2">
                      <Calendar className="h-8 w-8 mx-auto text-muted-foreground" />
                      <div className="text-xs font-medium text-muted-foreground">Updated</div>
                      <div className="text-sm">{formatDate(department.updatedAt)}</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              {/* Recent Expenses */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  Recent Expenses
                </h3>
                {expenses.length === 0 ? (
                  <Card>
                    <CardContent className="py-12">
                      <div className="text-center text-muted-foreground">
                        No expenses found for this department
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Expense #</TableHead>
                              <TableHead>Title</TableHead>
                              <TableHead>Category</TableHead>
                              <TableHead>Amount</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Date</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {expenses.slice(0, 5).map((expense) => (
                              <TableRow key={expense.id}>
                                <TableCell className="font-mono text-xs">
                                  {expense.expenseNumber}
                                </TableCell>
                                <TableCell className="font-medium">{expense.title}</TableCell>
                                <TableCell className="text-sm">
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
                                <TableCell className="text-sm">
                                  {formatDate(expense.expenseDate)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                      {expenses.length > 5 && (
                        <div className="p-4 text-center text-sm text-muted-foreground border-t">
                          Showing 5 of {expenses.length} expenses
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Budgets */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Budgets
                </h3>
                {budgets.length === 0 ? (
                  <Card>
                    <CardContent className="py-12">
                      <div className="text-center text-muted-foreground">
                        No budgets assigned to this department
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {budgets.map((budget) => (
                      <Card key={budget.id}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-base">{budget.name}</CardTitle>
                              <p className="text-sm text-muted-foreground mt-1">
                                {EXPENSE_CATEGORY_LABELS[budget.category]} • {budget.budgetPeriod}
                              </p>
                            </div>
                            <Badge
                              variant={
                                budget.status === 'ACTIVE'
                                  ? 'default'
                                  : budget.status === 'EXCEEDED'
                                  ? 'destructive'
                                  : 'secondary'
                              }
                            >
                              {budget.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <div className="text-muted-foreground">Allocated</div>
                                <div className="font-semibold">
                                  {formatCurrency(budget.allocatedAmount)}
                                </div>
                              </div>
                              <div>
                                <div className="text-muted-foreground">Spent</div>
                                <div className="font-semibold">
                                  {formatCurrency(budget.spentAmount)}
                                </div>
                              </div>
                              <div>
                                <div className="text-muted-foreground">Remaining</div>
                                <div className="font-semibold">
                                  {formatCurrency(budget.remainingAmount)}
                                </div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Utilization</span>
                                <span className="font-medium">
                                  {((budget.spentAmount / budget.allocatedAmount) * 100).toFixed(1)}%
                                </span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div
                                  className="bg-primary h-2 rounded-full transition-all"
                                  style={{
                                    width: `${Math.min(
                                      (budget.spentAmount / budget.allocatedAmount) * 100,
                                      100
                                    )}%`,
                                  }}
                                />
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                              <span>
                                {formatDate(budget.startDate)} - {formatDate(budget.endDate)}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="py-12 text-center text-muted-foreground">Department not found</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
