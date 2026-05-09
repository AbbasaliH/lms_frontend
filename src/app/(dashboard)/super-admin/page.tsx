'use client';

import { StatsCard } from '@/components/dashboard/stats-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSuperAdminOverview, useSuperAdminActivities } from '@/lib/hooks/use-admin';
import { DollarSign, Package, Users, Store, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';

export default function SuperAdminDashboard() {
  const { data: overviewData, isLoading: overviewLoading, isError: overviewError } = useSuperAdminOverview();
  const { data: activitiesData, isLoading: activitiesLoading } = useSuperAdminActivities();

  const stats = (overviewData as any)?.data || {};
  const activities = (activitiesData as any)?.data || [];

  if (overviewLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (overviewError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Failed to load dashboard data.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Super Admin Dashboard</h2>
        <p className="text-muted-foreground">
          Platform-wide overview and management
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value={`$${(stats.revenue ?? 0).toLocaleString()}`}
          icon={DollarSign}
          trend={{ value: 15.3, isPositive: true }}
        />
        <StatsCard
          title="Total Orders"
          value={stats.totalOrders ?? 0}
          icon={Package}
          trend={{ value: 10.5, isPositive: true }}
        />
        <StatsCard
          title="Total Customers"
          value={stats.totalCustomers ?? 0}
          icon={Users}
          trend={{ value: 7.8, isPositive: true }}
        />
        <StatsCard
          title="Active Shops"
          value={stats.activeShops ?? 0}
          icon={Store}
          description="Across all locations"
        />
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          {activitiesLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : activities.length === 0 ? (
            <p className="text-muted-foreground text-sm">No recent activities.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activities.slice(0, 10).map((activity: any) => (
                  <TableRow key={activity.id || activity._id}>
                    <TableCell className="font-medium">{activity.action || activity.type || 'N/A'}</TableCell>
                    <TableCell>{activity.description || activity.message || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant={activity.status === 'success' ? 'default' : 'secondary'}>
                        {activity.status || 'N/A'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {activity.createdAt
                        ? format(new Date(activity.createdAt), 'MMM dd, yyyy HH:mm')
                        : 'N/A'}
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
