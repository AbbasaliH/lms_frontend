'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Receipt, TrendingUp, DollarSign, AlertCircle, FileText } from 'lucide-react';
import {
  useExpenseStatistics,
  useCategorySummary,
  useMonthlyTrends,
  useExpenses,
  useBudgets,
} from '@/lib/hooks/use-expenses';
import { StatsCard } from '@/components/dashboard/stats-card';
import { CategoryPieChart } from '@/components/expenses/category-pie-chart';
import { MonthlyTrendsChart } from '@/components/expenses/monthly-trends-chart';
import { BudgetUtilizationBar } from '@/components/expenses/budget-utilization-bar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ExpenseStatusBadge } from '@/components/expenses/expense-status-badge';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { EXPENSE_CATEGORY_LABELS } from '@/lib/constants/expense';
import { BudgetStatus } from '@/lib/types/expense';

export default function ExpensesPage() {
  const router = useRouter();
  const [dateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  // Fetch data
  const { data: statsData, isLoading: statsLoading } = useExpenseStatistics(dateRange);
  const { data: categoryData, isLoading: categoryLoading } = useCategorySummary(dateRange);
  const { data: trendsData, isLoading: trendsLoading } = useMonthlyTrends(6);
  const { data: recentExpenses, isLoading: expensesLoading } = useExpenses({
    page: 1,
    limit: 5,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const { data: budgetsData, isLoading: budgetsLoading } = useBudgets({
    page: 1,
    limit: 4,
    status: BudgetStatus.ACTIVE,
  });

  const stats = statsData?.data;
  const categories = categoryData?.data || [];
  const trends = trendsData?.data || [];
  const expenses = recentExpenses?.data?.expenses || [];
  const budgets = budgetsData?.data?.budgets || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Expense Management</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage business expenses, budgets, and payments
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push('/admin/expenses/reports')}
          >
            <FileText className="h-4 w-4 mr-2" />
            Reports
          </Button>
          <Button onClick={() => router.push('/admin/expenses/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Add Expense
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      {statsLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : stats ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Expenses"
            value={formatCurrency(stats.totalAmount)}
            icon={Receipt}
            description={`${stats.totalExpenses} expenses`}
            variant="default"
          />
          <StatsCard
            title="Paid"
            value={formatCurrency(stats.paidAmount)}
            icon={DollarSign}
            description={`${stats.approvedCount} approved`}
            variant="success"
          />
          <StatsCard
            title="Unpaid"
            value={formatCurrency(stats.unpaidAmount)}
            icon={AlertCircle}
            description={`${stats.overdueCount} overdue`}
            variant="warning"
          />
          <StatsCard
            title="Pending Approval"
            value={stats.pendingApprovalCount}
            icon={TrendingUp}
            description={`Avg: ${formatCurrency(stats.averageExpenseAmount)}`}
            variant="default"
          />
        </div>
      ) : null}

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Category Pie Chart */}
        {categoryLoading ? (
          <Skeleton className="h-[400px]" />
        ) : categories.length > 0 ? (
          <CategoryPieChart data={categories} />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Expenses by Category</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-[300px]">
              <p className="text-muted-foreground">No expense data available</p>
            </CardContent>
          </Card>
        )}

        {/* Monthly Trends */}
        {trendsLoading ? (
          <Skeleton className="h-[400px]" />
        ) : trends.length > 0 ? (
          <MonthlyTrendsChart data={trends} />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Monthly Expense Trends</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-[300px]">
              <p className="text-muted-foreground">No trend data available</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent Expenses & Budget Utilization */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Recent Expenses */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Expenses</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/admin/expenses/list')}
            >
              View All
            </Button>
          </CardHeader>
          <CardContent>
            {expensesLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16" />
                ))}
              </div>
            ) : expenses.length === 0 ? (
              <div className="text-center py-8">
                <Receipt className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No expenses yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenses.map((expense) => (
                      <TableRow
                        key={expense.id}
                        className="cursor-pointer"
                        onClick={() => router.push(`/admin/expenses/${expense.id}`)}
                      >
                        <TableCell className="font-medium">{expense.title}</TableCell>
                        <TableCell className="text-sm">
                          {EXPENSE_CATEGORY_LABELS[expense.category]}
                        </TableCell>
                        <TableCell>{formatCurrency(expense.totalAmount)}</TableCell>
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
            )}
          </CardContent>
        </Card>

        {/* Budget Utilization */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Active Budgets</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/admin/expenses/budgets')}
            >
              View All
            </Button>
          </CardHeader>
          <CardContent>
            {budgetsLoading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-24" />
                ))}
              </div>
            ) : budgets.length === 0 ? (
              <div className="text-center py-8">
                <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No active budgets</p>
              </div>
            ) : (
              <div className="space-y-3">
                {budgets.map((budget) => (
                  <BudgetUtilizationBar key={budget.id} budget={budget} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => router.push('/admin/expenses/list')}
            >
              <Receipt className="h-4 w-4 mr-2" />
              View All Expenses
            </Button>
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => router.push('/admin/expenses/budgets')}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Manage Budgets
            </Button>
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => router.push('/admin/expenses/departments')}
            >
              <FileText className="h-4 w-4 mr-2" />
              Departments
            </Button>
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => router.push('/admin/expenses/reports')}
            >
              <FileText className="h-4 w-4 mr-2" />
              Analytics & Reports
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}