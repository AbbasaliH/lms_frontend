'use client';

import { StatsCard } from '@/components/dashboard/stats-card';
import { StatsCardSkeleton } from '@/components/dashboard/stats-card-skeleton';
import { TableSkeleton } from '@/components/dashboard/table-skeleton';
import { CreateOrderCardSkeleton } from '@/components/dashboard/create-order-card-skeleton';
import { RevenueChart } from '@/components/dashboard/revenue-chart';
import { OrderDistributionChart } from '@/components/dashboard/order-distribution-chart';
import { OrderStatusChart } from '@/components/dashboard/order-status-chart';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { PerformanceMetrics } from '@/components/dashboard/performance-metrics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  DollarSign, 
  Package, 
  ShoppingCart, 
  Users, 
  Truck, 
  Repeat, 
  Wallet,
  MessageSquare,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  Plus,
  Sparkles,
  AlertCircle,
  ArrowUpRight,
  Activity,
  CalendarDays
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { useAnalyticsOverview } from '@/lib/hooks/use-analytics';
import { CreateOrderDialog } from '@/components/orders/create-order-dialog';
import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '@/lib/api/orders';
import type { ApiOrder } from '@/lib/types/api';

const getStatusBadgeVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'default';
    case 'processing':
      return 'secondary';
    case 'ready':
      return 'outline';
    case 'delivered':
      return 'default';
    case 'cancelled':
      return 'destructive';
    default:
      return 'default';
  }
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
    case 'processing':
      return 'bg-blue-500/10 text-blue-700 dark:text-blue-400';
    case 'ready':
      return 'bg-green-500/10 text-green-700 dark:text-green-400';
    case 'delivered':
      return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400';
    case 'cancelled':
      return 'bg-red-500/10 text-red-700 dark:text-red-400';
    default:
      return 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
  }
};

export default function AdminDashboard() {
  const { data: analyticsData, isLoading, error } = useAnalyticsOverview();
  
  // Fetch orders from API
  const { 
    data: ordersData, 
    isLoading: isLoadingOrders, 
    error: ordersError,
    refetch: refetchOrders 
  } = useQuery({
    queryKey: ['orders'],
    queryFn: () => ordersApi.getOrders(),
  });

  // Extract data from API response
  const stats = analyticsData?.data;
  
  // Get recent orders (latest 5)
  const recentOrders = ordersData?.data
    ? [...ordersData.data]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)
    : [];

  // Calculate completion rate percentage
  const completionRate = stats?.orders.completionRate 
    ? `${Math.round(stats.orders.completionRate)}%` 
    : '0%';

  // Calculate average order value
  const averageOrderValue = stats?.orders.total && stats.orders.total > 0 
    ? stats.revenue.total / stats.orders.total 
    : 0;

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4 animate-in fade-in-50 slide-in-from-top-4 duration-500 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="heading-lg text-ocean-gradient">Dashboard</h1>
          <p className="body-base text-muted-foreground mt-1">
            Welcome to your advanced laundry management system
          </p>
          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            <span>{format(new Date(), 'EEEE, MMMM dd, yyyy')}</span>
          </div>
        </div>
        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Updating...</span>
          </div>
        )}
      </div>

      {/* Error State */}
      {error && (
        <Card className="border-destructive animate-in fade-in-50 slide-in-from-top-4 duration-500">
          <CardContent className="flex items-center gap-3 p-4">
            <XCircle className="h-5 w-5 text-destructive" />
            <div>
              <p className="font-medium text-destructive">Failed to load analytics data</p>
              <p className="text-sm text-muted-foreground">Please check your connection and try again</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Order Highlighted Section */}
      {isLoading ? (
        <CreateOrderCardSkeleton />
      ) : (
        <Card className="border-2 border-primary bg-gradient-to-br from-primary/5 via-primary/8 to-accent/5 shadow-lg animate-in fade-in-50 slide-in-from-bottom-4 duration-500 hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary p-4 transition-transform hover:scale-110 shadow-md">
                  <Package className="h-7 w-7 text-primary-foreground" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-bold">Create New Order</h3>
                    <Sparkles className="h-6 w-6 text-primary animate-pulse" />
                  </div>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Start processing a new laundry order for your customers. Track, manage, and deliver with ease.
                  </p>
                  <div className="flex items-center gap-4 pt-2">
                    <div className="flex items-center gap-1.5">
                      <Activity className="h-4 w-4 text-primary" />
                      <span className="text-xs font-medium">Fast Processing</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="text-xs font-medium">Real-time Tracking</span>
                    </div>
                  </div>
                </div>
              </div>
              <CreateOrderDialog>
                <Button size="lg" className="w-full md:w-auto shadow-lg transition-all hover:shadow-xl hover:scale-105">
                  <Plus className="h-5 w-5" />
                  New Order
                  <ArrowUpRight className="h-4 w-4 ml-1" />
                </Button>
              </CreateOrderDialog>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold animate-in fade-in-50 slide-in-from-left-4 duration-500">Key Metrics</h3>
          <Badge variant="outline" className="gap-1">
            <Activity className="h-3 w-3" />
            Live
          </Badge>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {isLoading ? (
            <>
              <StatsCardSkeleton />
              <StatsCardSkeleton />
              <StatsCardSkeleton />
              <StatsCardSkeleton />
            </>
          ) : (
            <>
              <StatsCard
                title="Total Revenue"
                value={`₹${stats?.revenue.total.toLocaleString() || '0'}`}
                icon={DollarSign}
                description="All time earnings"
                trend={{
                  value: 12.5,
                  isPositive: true,
                }}
              />
              <StatsCard
                title="Total Orders"
                value={stats?.orders.total.toLocaleString() || '0'}
                icon={ShoppingCart}
                description="All time orders"
                trend={{
                  value: 8.2,
                  isPositive: true,
                }}
              />
              <StatsCard
                title="Active Customers"
                value={stats?.users.total.toLocaleString() || '0'}
                icon={Users}
                description="Registered users"
                trend={{
                  value: 15.3,
                  isPositive: true,
                }}
              />
              <StatsCard
                title="Avg. Order Value"
                value={`₹${Math.round(averageOrderValue).toLocaleString()}`}
                icon={TrendingUp}
                description="Per order average"
                trend={{
                  value: 5.7,
                  isPositive: true,
                }}
              />
            </>
          )}
        </div>
      </div>

      {/* Charts Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold animate-in fade-in-50 slide-in-from-left-4 duration-500">Analytics Overview</h3>
        <Tabs defaultValue="revenue" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
            <TabsTrigger value="revenue">Revenue Trends</TabsTrigger>
            <TabsTrigger value="distribution">Service Distribution</TabsTrigger>
            <TabsTrigger value="status">Order Status</TabsTrigger>
          </TabsList>
          <TabsContent value="revenue" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <RevenueChart />
              </div>
              <div>
                <PerformanceMetrics />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="distribution" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <OrderDistributionChart />
              </div>
              <div>
                <PerformanceMetrics />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="status" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <OrderStatusChart />
              </div>
              <div>
                <PerformanceMetrics />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Orders & Operations Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold animate-in fade-in-50 slide-in-from-left-4 duration-500">Orders & Operations</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {isLoading ? (
            <>
              <StatsCardSkeleton />
              <StatsCardSkeleton />
              <StatsCardSkeleton />
              <StatsCardSkeleton />
            </>
          ) : (
            <>
              <StatsCard
                title="Pending Orders"
                value={stats?.orders.pending.toLocaleString() || '0'}
                icon={Clock}
                description="Awaiting processing"
                variant="warning"
              />
              <StatsCard
                title="Completed Orders"
                value={stats?.orders.completed.toLocaleString() || '0'}
                icon={CheckCircle2}
                description={`${completionRate} rate`}
                variant="success"
              />
              <StatsCard
                title="Delivery Boys"
                value={stats?.users.deliveryBoys.toLocaleString() || '0'}
                icon={Truck}
                description="Active drivers"
              />
              <StatsCard
                title="Active Subscriptions"
                value={stats?.subscriptions.active.toLocaleString() || '0'}
                icon={Repeat}
                description="Recurring customers"
              />
            </>
          )}
        </div>
      </div>

      {/* Quick Actions & Recent Orders */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <QuickActions />

        {/* Business Stats */}
        <Card className="animate-in fade-in-50 slide-in-from-bottom-4 duration-700">
          <CardHeader>
            <CardTitle>Business Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 grid-cols-2">
              <div className="space-y-2 p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                  <p className="text-xs font-medium text-muted-foreground">Wallet Balance</p>
                </div>
                <p className="text-2xl font-bold">₹{stats?.wallet.totalBalance.toLocaleString() || '0'}</p>
              </div>
              <div className="space-y-2 p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <p className="text-xs font-medium text-muted-foreground">Pending Queries</p>
                </div>
                <p className="text-2xl font-bold">{stats?.queries.pending.toLocaleString() || '0'}</p>
              </div>
              <div className="space-y-2 p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-muted-foreground" />
                  <p className="text-xs font-medium text-muted-foreground">Cancelled</p>
                </div>
                <p className="text-2xl font-bold">{stats?.orders.cancelled.toLocaleString() || '0'}</p>
              </div>
              <div className="space-y-2 p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <p className="text-xs font-medium text-muted-foreground">Avg Revenue</p>
                </div>
                <p className="text-2xl font-bold">₹{stats?.revenue.average.toLocaleString() || '0'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="animate-in fade-in-50 slide-in-from-bottom-4 duration-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Orders</CardTitle>
          {isLoadingOrders && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading...</span>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {isLoadingOrders ? (
            <TableSkeleton rows={5} columns={6} />
          ) : ordersError ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <AlertCircle className="h-12 w-12 text-destructive" />
              <div className="text-center">
                <p className="font-medium text-destructive mb-2">Failed to load recent orders</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Please check your connection and try again
                </p>
                <Button onClick={() => refetchOrders()} variant="outline" size="sm">
                  <Loader2 className="mr-2 h-4 w-4" />
                  Retry
                </Button>
              </div>
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-2">No orders yet</p>
              <p className="text-sm text-muted-foreground mb-4">
                Create your first order to get started
              </p>
              <CreateOrderDialog>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Order
                </Button>
              </CreateOrderDialog>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order: ApiOrder, index: number) => (
                  <TableRow 
                    key={order.id}
                    className="animate-in fade-in-50 slide-in-from-bottom-2 duration-500"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <TableCell className="font-mono text-xs font-medium">
                      #{order.id.slice(0, 8)}...
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{order.user.fullName}</span>
                        <span className="text-xs text-muted-foreground">
                          {order.user.phoneNumber}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{order.product.name}</span>
                        <span className="text-xs text-muted-foreground capitalize">
                          {order.product.category}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm">{format(new Date(order.createdAt), 'MMM dd, yyyy')}</span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(order.createdAt), 'hh:mm a')}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      ₹{order.totalAmount.toFixed(2)}
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
