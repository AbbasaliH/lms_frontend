'use client';

import { StatsCard } from '@/components/dashboard/stats-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAnalyticsRevenue, useAnalyticsDailyRevenue } from '@/lib/hooks/use-analytics';
import { DollarSign, TrendingUp, CreditCard, Wallet, Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function RevenuePage() {
  const { data: revenueData, isLoading: revenueLoading, isError: revenueError } = useAnalyticsRevenue();
  const { data: dailyRevenueData, isLoading: dailyLoading } = useAnalyticsDailyRevenue(30);

  const stats = (revenueData as any)?.data || {};
  const daily = (dailyRevenueData as any)?.data || [];

  if (revenueLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (revenueError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Failed to load revenue data.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Revenue</h2>
        <p className="text-muted-foreground">
          Track platform revenue and financial metrics
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value={`$${(stats.totalRevenue ?? stats.revenue ?? 0).toLocaleString()}`}
          icon={DollarSign}
          trend={{ value: stats.growth ?? stats.revenueChange ?? 0, isPositive: true }}
        />
        <StatsCard
          title="Monthly Growth"
          value={`${stats.monthlyGrowth ?? stats.growth ?? 0}%`}
          icon={TrendingUp}
          trend={{ value: stats.growthChange ?? 0, isPositive: true }}
        />
        <StatsCard
          title="Commission Earned"
          value={`$${(stats.commissionEarned ?? 0).toLocaleString()}`}
          icon={CreditCard}
          trend={{ value: stats.commissionChange ?? 0, isPositive: true }}
        />
        <StatsCard
          title="Pending Settlements"
          value={`$${(stats.pendingSettlements ?? 0).toLocaleString()}`}
          icon={Wallet}
          description="Awaiting processing"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daily Revenue (Last 30 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          {dailyLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : daily.length === 0 ? (
            <p className="text-muted-foreground text-sm">No daily revenue data available.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Orders</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {daily.slice(0, 10).map((day: any, idx: number) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium">{day.date || day.day || 'N/A'}</TableCell>
                    <TableCell>${(day.revenue ?? day.amount ?? 0).toLocaleString()}</TableCell>
                    <TableCell>{day.orders ?? day.orderCount ?? 0}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
