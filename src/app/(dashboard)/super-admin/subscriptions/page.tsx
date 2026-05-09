'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/dashboard/stats-card';
import { useSubscriptionStats, useSubscriptions } from '@/lib/hooks/use-subscriptions';
import { Repeat, TrendingUp, Users, DollarSign, Loader2, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useDeleteSubscription } from '@/lib/hooks/use-subscriptions';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function SuperAdminSubscriptionsPage() {
  const { data: statsData, isLoading: statsLoading, isError: statsError } = useSubscriptionStats();
  const { data: subscriptionsData, isLoading: listLoading } = useSubscriptions();
  const deleteMutation = useDeleteSubscription();

  const stats = (statsData as any)?.data || {};
  const subscriptions = (subscriptionsData as any)?.data?.data?.subscriptions || [];

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this subscription?')) {
      deleteMutation.mutate(id, {
        onError: (error: Error) => {
          toast.error(error.message || 'Failed to delete subscription');
        },
      });
    }
  };

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (statsError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Failed to load subscriptions data.</p>
      </div>
    );
  }

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
          value={stats.activeSubscriptions ?? stats.active ?? 0}
          icon={Repeat}
          trend={{ value: stats.activeChange ?? 0, isPositive: true }}
        />
        <StatsCard
          title="Subscription Revenue"
          value={`$${(stats.subscriptionRevenue ?? stats.revenue ?? 0).toLocaleString()}`}
          icon={DollarSign}
          trend={{ value: stats.revenueChange ?? 0, isPositive: true }}
        />
        <StatsCard
          title="Renewal Rate"
          value={`${stats.renewalRate ?? 0}%`}
          icon={TrendingUp}
          trend={{ value: stats.renewalChange ?? 0, isPositive: true }}
        />
        <StatsCard
          title="New This Month"
          value={stats.newThisMonth ?? stats.newSubscriptions ?? 0}
          icon={Users}
          description="New subscribers"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          {listLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : subscriptions.length === 0 ? (
            <p className="text-muted-foreground text-sm">No subscriptions found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plan</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions.map((sub: any) => (
                  <TableRow key={sub.id}>
                    <TableCell className="font-medium">{sub.plan?.name || sub.name || 'N/A'}</TableCell>
                    <TableCell>{sub.user?.fullName || sub.customerName || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant={sub.status === 'active' || sub.status === 'ACTIVE' ? 'default' : 'secondary'}>
                        {sub.status || 'N/A'}
                      </Badge>
                    </TableCell>
                    <TableCell>{sub.startDate ? format(new Date(sub.startDate), 'MMM dd, yyyy') : 'N/A'}</TableCell>
                    <TableCell>{sub.endDate ? format(new Date(sub.endDate), 'MMM dd, yyyy') : 'N/A'}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(sub.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
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
