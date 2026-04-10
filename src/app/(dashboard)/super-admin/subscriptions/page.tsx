'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/dashboard/stats-card';
import { Repeat, TrendingUp, Users, DollarSign } from 'lucide-react';

export default function SuperAdminSubscriptionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Subscriptions</h2>
        <p className="text-muted-foreground">
          Platform-wide subscription overview and management
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Active Subscriptions"
          value="65"
          icon={Repeat}
          trend={{ value: 8.5, isPositive: true }}
        />
        <StatsCard
          title="Subscription Revenue"
          value="$12,935"
          icon={DollarSign}
          trend={{ value: 15.2, isPositive: true }}
        />
        <StatsCard
          title="Renewal Rate"
          value="92%"
          icon={TrendingUp}
          trend={{ value: 5.3, isPositive: true }}
        />
        <StatsCard
          title="New This Month"
          value="12"
          icon={Users}
          description="New subscribers"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subscription Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Detailed subscription analytics coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}