'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DollarSign,
  TrendingDown,
  TrendingUp,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  FileText,
} from 'lucide-react';
import { RevenueExpenseChart } from '@/components/finance/revenue-expense-chart';
import { ExpenseBreakdownChart } from '@/components/finance/expense-breakdown-chart';
import { CashFlowChart } from '@/components/finance/cash-flow-chart';
import { BudgetComparisonChart } from '@/components/finance/budget-comparison-chart';
import { ProfitLossCard } from '@/components/finance/profit-loss-card';
import { FinancialRatiosSection } from '@/components/finance/financial-ratios-section';
import { useFinancialMetrics } from '@/lib/hooks/use-finance';
import { Skeleton } from '@/components/ui/skeleton';

function MetricCard({
  title,
  value,
  change,
  icon: Icon,
  trend,
}: {
  title: string;
  value: string;
  change: number;
  icon: React.ElementType;
  trend: 'up' | 'down';
}) {
  const isPositive = (trend === 'up' && change > 0) || (trend === 'down' && change < 0);
  const TrendIcon = change > 0 ? ArrowUpRight : ArrowDownRight;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center gap-1 text-xs">
          <TrendIcon
            className={`h-3 w-3 ${isPositive ? 'text-success' : 'text-destructive'}`}
          />
          <span className={isPositive ? 'text-success' : 'text-destructive'}>
            {Math.abs(change)}%
          </span>
          <span className="text-muted-foreground">from last month</span>
        </div>
      </CardContent>
    </Card>
  );
}

function MetricCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4 rounded-full" />
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-3 w-40" />
      </CardContent>
    </Card>
  );
}

export default function FinancePage() {
  const { data: metricsData, isLoading } = useFinancialMetrics();
  const metrics = metricsData?.data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Finance Dashboard</h2>
          <p className="text-muted-foreground">
            Comprehensive financial overview and analytics
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" disabled>
            <FileText className="h-4 w-4" />
            Generate Report
          </Button>
          <Button disabled>
            <Download className="h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {isLoading ? (
          <>
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
          </>
        ) : metrics ? (
          <>
            <MetricCard
              title="Total Revenue"
              value={`₹${metrics.totalRevenue.toLocaleString()}`}
              change={metrics.revenueChange ?? 0}
              icon={DollarSign}
              trend="up"
            />
            <MetricCard
              title="Total Expenses"
              value={`₹${metrics.totalExpenses.toLocaleString()}`}
              change={metrics.expenseChange ?? 0}
              icon={TrendingDown}
              trend="down"
            />
            <MetricCard
              title="Net Profit"
              value={`₹${metrics.netProfit.toLocaleString()}`}
              change={metrics.profitChange ?? 0}
              icon={TrendingUp}
              trend="up"
            />
            <MetricCard
              title="Profit Margin"
              value={`${metrics.profitMargin.toFixed(2)}%`}
              change={metrics.profitChange ?? 0}
              icon={TrendingUp}
              trend="up"
            />
            <MetricCard
              title="Cash Flow"
              value={`₹${(metrics.cashFlow ?? metrics.netProfit).toLocaleString()}`}
              change={metrics.cashFlowChange ?? 0}
              icon={Wallet}
              trend="up"
            />
            <MetricCard
              title="Receivables"
              value={`₹${metrics.outstandingReceivables.toLocaleString()}`}
              change={metrics.receivablesChange ?? 0}
              icon={DollarSign}
              trend="down"
            />
          </>
        ) : null}
      </div>

      {/* Profit & Loss Statement */}
      <ProfitLossCard />

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-1">
        <RevenueExpenseChart />
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ExpenseBreakdownChart />
        <CashFlowChart />
      </div>

      {/* Budget Comparison */}
      <BudgetComparisonChart />

      {/* Financial Ratios */}
      <FinancialRatiosSection />
    </div>
  );
}
