'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Loader2,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAnalyticsOverview } from '@/lib/hooks/use-analytics';
import { format, subDays, subMonths } from 'date-fns';

// Mock data for charts (in real app, this would come from API)
const revenueData = [
  { month: 'Jan', revenue: 45000, orders: 120, customers: 85 },
  { month: 'Feb', revenue: 52000, orders: 145, customers: 98 },
  { month: 'Mar', revenue: 48000, orders: 135, customers: 92 },
  { month: 'Apr', revenue: 61000, orders: 168, customers: 112 },
  { month: 'May', revenue: 55000, orders: 152, customers: 105 },
  { month: 'Jun', revenue: 67000, orders: 185, customers: 128 },
  { month: 'Jul', revenue: 72000, orders: 198, customers: 142 },
  { month: 'Aug', revenue: 68000, orders: 188, customers: 135 },
  { month: 'Sep', revenue: 75000, orders: 205, customers: 148 },
  { month: 'Oct', revenue: 82000, orders: 225, customers: 165 },
  { month: 'Nov', revenue: 88000, orders: 242, customers: 178 },
  { month: 'Dec', revenue: 95000, orders: 268, customers: 195 },
];

const orderStatusData = [
  { name: 'Completed', value: 450, color: 'hsl(var(--chart-1))' },
  { name: 'Processing', value: 125, color: 'hsl(var(--chart-2))' },
  { name: 'Pending', value: 85, color: 'hsl(var(--chart-3))' },
  { name: 'Cancelled', value: 28, color: 'hsl(var(--chart-4))' },
];

const serviceTypeData = [
  { name: 'Wash & Fold', value: 320, revenue: 48000 },
  { name: 'Dry Cleaning', value: 180, revenue: 54000 },
  { name: 'Ironing', value: 145, revenue: 21750 },
  { name: 'Express Service', value: 95, revenue: 28500 },
  { name: 'Alterations', value: 48, revenue: 14400 },
];

const dailyOrdersData = Array.from({ length: 14 }, (_, i) => ({
  date: format(subDays(new Date(), 13 - i), 'MMM dd'),
  orders: Math.floor(Math.random() * 30) + 15,
  revenue: Math.floor(Math.random() * 8000) + 3000,
}));

const topCustomersData = [
  { name: 'Alice Johnson', orders: 45, spent: 12500, trend: 'up' },
  { name: 'Bob Smith', orders: 38, spent: 10200, trend: 'up' },
  { name: 'Carol Williams', orders: 32, spent: 8900, trend: 'down' },
  { name: 'David Brown', orders: 28, spent: 7800, trend: 'up' },
  { name: 'Emma Davis', orders: 24, spent: 6500, trend: 'up' },
];

const deliveryPerformanceData = [
  { name: 'On Time', value: 785, percentage: 92 },
  { name: 'Late', value: 52, percentage: 6 },
  { name: 'Failed', value: 18, percentage: 2 },
];

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ElementType;
  description: string;
  isLoading?: boolean;
}

function MetricCard({ title, value, change, icon: Icon, description, isLoading }: MetricCardProps) {
  const isPositive = change !== undefined && change > 0;
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change !== undefined && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            {isPositive ? (
              <ArrowUpRight className="h-3 w-3 text-success" />
            ) : (
              <ArrowDownRight className="h-3 w-3 text-destructive" />
            )}
            <span className={isPositive ? 'text-success' : 'text-destructive'}>
              {Math.abs(change)}%
            </span>
            <span className="ml-1">{description}</span>
          </div>
        )}
        {change === undefined && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const { data: analyticsData, isLoading } = useAnalyticsOverview();
  const stats = analyticsData?.data;

  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  // Simulated previous period data for trend calculation
  const previousRevenue = 380000;
  const previousOrders = 2100;
  const previousCustomers = 1200;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            Comprehensive insights and performance metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4" />
            Custom Range
          </Button>
          <div className="flex gap-1 rounded-lg border p-1">
            {(['7d', '30d', '90d', '1y'] as const).map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setTimeRange(range)}
                className="h-7 px-3"
              >
                {range === '7d' && '7 Days'}
                {range === '30d' && '30 Days'}
                {range === '90d' && '90 Days'}
                {range === '1y' && '1 Year'}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Revenue"
          value={`₹${(stats?.revenue.total || 0).toLocaleString()}`}
          change={calculateChange(stats?.revenue.total || 0, previousRevenue)}
          icon={DollarSign}
          description="from last period"
          isLoading={isLoading}
        />
        <MetricCard
          title="Total Orders"
          value={(stats?.orders.total || 0).toLocaleString()}
          change={calculateChange(stats?.orders.total || 0, previousOrders)}
          icon={ShoppingCart}
          description="from last period"
          isLoading={isLoading}
        />
        <MetricCard
          title="Active Customers"
          value={(stats?.users.total || 0).toLocaleString()}
          change={calculateChange(stats?.users.total || 0, previousCustomers)}
          icon={Users}
          description="from last period"
          isLoading={isLoading}
        />
        <MetricCard
          title="Avg Order Value"
          value={`₹${stats?.revenue.average || 0}`}
          change={8.2}
          icon={TrendingUp}
          description="from last period"
          isLoading={isLoading}
        />
      </div>

      {/* Revenue & Orders Trend */}
      <div className="grid gap-4 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Revenue & Orders Trend</CardTitle>
            <CardDescription>Monthly performance over the last year</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="month" 
                    stroke="hsl(var(--muted-foreground))"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    style={{ fontSize: '12px' }}
                    tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number | undefined) => value ? [`₹${value.toLocaleString()}`, 'Revenue'] : ['', '']}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Order Status Distribution</CardTitle>
            <CardDescription>Current orders breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service Types & Daily Orders */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Service Type Performance</CardTitle>
            <CardDescription>Revenue by service category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={serviceTypeData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    type="number"
                    stroke="hsl(var(--muted-foreground))"
                    style={{ fontSize: '12px' }}
                    tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                  />
                  <YAxis 
                    dataKey="name" 
                    type="category"
                    stroke="hsl(var(--muted-foreground))"
                    style={{ fontSize: '12px' }}
                    width={100}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number | undefined, name: string | undefined) => (value !== undefined && name) ? [
                      name === 'revenue' ? `₹${value.toLocaleString()}` : value,
                      name === 'revenue' ? 'Revenue' : 'Orders'
                    ] : ['', '']}
                  />
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Daily Orders Trend</CardTitle>
            <CardDescription>Last 14 days performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyOrdersData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))"
                    style={{ fontSize: '11px' }}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="orders" 
                    stroke="hsl(var(--chart-2))" 
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Customers & Delivery Performance */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Customers</CardTitle>
            <CardDescription>Highest revenue contributors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCustomersData.map((customer, index) => (
                <div key={customer.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {customer.orders} orders
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="font-semibold">₹{customer.spent.toLocaleString()}</p>
                      <div className="flex items-center gap-1 text-xs">
                        {customer.trend === 'up' ? (
                          <TrendingUp className="h-3 w-3 text-success" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-destructive" />
                        )}
                        <span className={customer.trend === 'up' ? 'text-success' : 'text-destructive'}>
                          {customer.trend === 'up' ? '+' : '-'}12%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Delivery Performance</CardTitle>
            <CardDescription>Delivery success metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {deliveryPerformanceData.map((item) => (
                <div key={item.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {item.name === 'On Time' && (
                        <CheckCircle2 className="h-4 w-4 text-success" />
                      )}
                      {item.name === 'Late' && (
                        <Clock className="h-4 w-4 text-warning" />
                      )}
                      {item.name === 'Failed' && (
                        <XCircle className="h-4 w-4 text-destructive" />
                      )}
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{item.value} deliveries</span>
                      <Badge 
                        variant={
                          item.name === 'On Time' ? 'default' : 
                          item.name === 'Late' ? 'outline' : 
                          'destructive'
                        }
                      >
                        {item.percentage}%
                      </Badge>
                    </div>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full transition-all ${
                        item.name === 'On Time' ? 'bg-success' :
                        item.name === 'Late' ? 'bg-warning' :
                        'bg-destructive'
                      }`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
              <div className="mt-6 rounded-lg bg-muted/50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Average Delivery Time</p>
                    <p className="text-2xl font-bold">2.3 hours</p>
                  </div>
                  <Activity className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Insights */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.orders.completionRate 
                ? `${Math.round(stats.orders.completionRate)}%` 
                : '0%'}
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
              <div 
                className="h-full bg-success transition-all"
                style={{ width: `${stats?.orders.completionRate || 0}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {stats?.orders.completed || 0} of {stats?.orders.total || 0} orders completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.subscriptions.active || 0}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Recurring revenue stream
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivery Fleet</CardTitle>
            <Users className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.users.deliveryBoys || 0}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Active delivery personnel
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
