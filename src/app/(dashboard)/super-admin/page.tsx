'use client';

import { StatsCard } from '@/components/dashboard/stats-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockSuperAdminDashboardStats, mockShops } from '@/lib/mock-data';
import { DollarSign, Package, Store, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function SuperAdminDashboard() {
  const stats = mockSuperAdminDashboardStats;

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
          value={`$${stats.revenue.toLocaleString()}`}
          icon={DollarSign}
          trend={{ value: 15.3, isPositive: true }}
        />
        <StatsCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={Package}
          trend={{ value: 10.5, isPositive: true }}
        />
        <StatsCard
          title="Total Customers"
          value={stats.totalCustomers}
          icon={Users}
          trend={{ value: 7.8, isPositive: true }}
        />
        <StatsCard
          title="Active Shops"
          value={mockShops.length}
          icon={Store}
          description="Across all locations"
        />
      </div>

      {/* Shops Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Shop Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Shop Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockShops.map((shop) => (
                <TableRow key={shop.id}>
                  <TableCell className="font-medium">{shop.name}</TableCell>
                  <TableCell>{shop.address}</TableCell>
                  <TableCell>
                    <Badge variant={shop.status === 'active' ? 'default' : 'secondary'}>
                      {shop.status}
                    </Badge>
                  </TableCell>
                  <TableCell>${shop.revenue.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}