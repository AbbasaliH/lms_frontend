'use client';

import { StatsCard } from '@/components/dashboard/stats-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockSuperAdminDashboardStats } from '@/lib/mock-data';
import { DollarSign, TrendingUp, CreditCard, Wallet } from 'lucide-react';

export default function RevenuePage() {
  const stats = mockSuperAdminDashboardStats;

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
          value={`$${stats.revenue.toLocaleString()}`}
          icon={DollarSign}
          trend={{ value: 18.5, isPositive: true }}
        />
        <StatsCard
          title="Monthly Growth"
          value="15.3%"
          icon={TrendingUp}
          trend={{ value: 3.2, isPositive: true }}
        />
        <StatsCard
          title="Commission Earned"
          value="$12,500"
          icon={CreditCard}
          trend={{ value: 12.8, isPositive: true }}
        />
        <StatsCard
          title="Pending Settlements"
          value="$3,200"
          icon={Wallet}
          description="Awaiting processing"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Revenue charts and analytics coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}