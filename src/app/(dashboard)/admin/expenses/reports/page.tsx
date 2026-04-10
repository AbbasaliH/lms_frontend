'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileDown, TrendingUp } from 'lucide-react';
import {
  useExpenseStatistics,
  useCategorySummary,
  useDepartmentSummary,
  useMonthlyTrends,
} from '@/lib/hooks/use-expenses';
import { StatsCard } from '@/components/dashboard/stats-card';
import { CategoryPieChart } from '@/components/expenses/category-pie-chart';
import { MonthlyTrendsChart } from '@/components/expenses/monthly-trends-chart';
import { DepartmentBarChart } from '@/components/expenses/department-bar-chart';
import { formatCurrency } from '@/lib/utils/format';

export default function ExpenseReportsPage() {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  const { data: statsData, isLoading: statsLoading } = useExpenseStatistics(dateRange);
  const { data: categoryData, isLoading: categoryLoading } = useCategorySummary(dateRange);
  const { data: departmentData, isLoading: departmentLoading } = useDepartmentSummary(dateRange);
  const { data: trendsData, isLoading: trendsLoading } = useMonthlyTrends(12);

  const stats = statsData?.data;
  const categories = categoryData?.data || [];
  const departments = departmentData?.data || [];
  const trends = trendsData?.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Expense Reports & Analytics</h1>
          <p className="text-muted-foreground mt-1">
            View detailed expense analytics and insights
          </p>
        </div>
        <Button variant="outline">
          <FileDown className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Date Range Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Report Period</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
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
            icon={TrendingUp}
            description={`${stats.totalExpenses} transactions`}
          />
          <StatsCard
            title="Paid"
            value={formatCurrency(stats.paidAmount)}
            icon={TrendingUp}
            description={`${stats.approvedCount} approved`}
            variant="success"
          />
          <StatsCard
            title="Unpaid"
            value={formatCurrency(stats.unpaidAmount)}
            icon={TrendingUp}
            description={`${stats.overdueCount} overdue`}
            variant="warning"
          />
          <StatsCard
            title="Average Expense"
            value={formatCurrency(stats.averageExpenseAmount)}
            icon={TrendingUp}
            description={`${stats.pendingApprovalCount} pending approval`}
          />
        </div>
      ) : null}

      {/* Charts Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Category Breakdown */}
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
              <p className="text-muted-foreground">No data available</p>
            </CardContent>
          </Card>
        )}

        {/* Department Breakdown */}
        {departmentLoading ? (
          <Skeleton className="h-[400px]" />
        ) : departments.length > 0 ? (
          <DepartmentBarChart data={departments} />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Expenses by Department</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-[300px]">
              <p className="text-muted-foreground">No data available</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Monthly Trends */}
      {trendsLoading ? (
        <Skeleton className="h-[400px]" />
      ) : trends.length > 0 ? (
        <MonthlyTrendsChart data={trends} />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Monthly Trends</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-[300px]">
            <p className="text-muted-foreground">No trend data available</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}