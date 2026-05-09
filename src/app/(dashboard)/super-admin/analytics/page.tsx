'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAnalyticsOverview } from '@/lib/hooks/use-analytics';
import { Loader2, DollarSign, Package, Users, Repeat, MessageSquare, Wallet } from 'lucide-react';

export default function AnalyticsPage() {
  const { data, isLoading, isError } = useAnalyticsOverview();
  const overview = (data as any)?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Failed to load analytics data.</p>
      </div>
    );
  }

  const metrics = [
    {
      title: 'Total Revenue',
      value: `$${(overview?.revenue?.total ?? 0).toLocaleString()}`,
      sub: `Avg $${(overview?.revenue?.average ?? 0).toLocaleString()}`,
      icon: DollarSign,
    },
    {
      title: 'Total Orders',
      value: overview?.orders?.total ?? 0,
      sub: `${overview?.orders?.completed ?? 0} completed · ${overview?.orders?.pending ?? 0} pending`,
      icon: Package,
    },
    {
      title: 'Total Users',
      value: overview?.users?.total ?? 0,
      sub: `${overview?.users?.deliveryBoys ?? 0} delivery boys`,
      icon: Users,
    },
    {
      title: 'Active Subscriptions',
      value: overview?.subscriptions?.active ?? 0,
      sub: 'Currently active',
      icon: Repeat,
    },
    {
      title: 'Pending Queries',
      value: overview?.queries?.pending ?? 0,
      sub: 'Awaiting response',
      icon: MessageSquare,
    },
    {
      title: 'Wallet Balance',
      value: `$${(overview?.wallet?.totalBalance ?? 0).toLocaleString()}`,
      sub: 'Total user balances',
      icon: Wallet,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <p className="text-muted-foreground">
          Comprehensive platform analytics and insights
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-xs text-muted-foreground">{metric.sub}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
