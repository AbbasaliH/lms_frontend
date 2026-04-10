'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useRevenueExpenseTrends } from '@/lib/hooks/use-finance';
import { Loader2 } from 'lucide-react';
import type { TimePeriod } from '@/lib/types/finance';

export function RevenueExpenseChart() {
  const [period, setPeriod] = useState<TimePeriod>('monthly');
  const { data, isLoading } = useRevenueExpenseTrends(period);

  const chartData = data?.data || [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Revenue vs Expenses</CardTitle>
            <CardDescription>Track your revenue and expense trends over time</CardDescription>
          </div>
          <Tabs value={period} onValueChange={(value) => setPeriod(value as TimePeriod)}>
            <TabsList>
              <TabsTrigger value="weekly">Week</TabsTrigger>
              <TabsTrigger value="monthly">Month</TabsTrigger>
              <TabsTrigger value="quarterly">Quarter</TabsTrigger>
              <TabsTrigger value="yearly">Year</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-[350px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `₹${value / 1000}k`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  formatter={(value: number, name: string) => {
                    const label = name === 'revenue' ? 'Revenue' : name === 'expenses' ? 'Expenses' : 'Profit';
                    return [`₹${value.toLocaleString()}`, label];
                  }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                  formatter={(value) => {
                    if (value === 'revenue') return 'Revenue';
                    if (value === 'expenses') return 'Expenses';
                    return 'Profit';
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  fill="url(#colorRevenue)"
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                  fill="url(#colorExpenses)"
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  stroke="hsl(var(--chart-3))"
                  strokeWidth={2}
                  fill="url(#colorProfit)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
