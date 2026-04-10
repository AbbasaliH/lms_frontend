'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/lib/utils/format';
import type { MonthlyTrend } from '@/lib/types/expense';

interface MonthlyTrendsChartProps {
  data: MonthlyTrend[];
}

export function MonthlyTrendsChart({ data }: MonthlyTrendsChartProps) {
  const chartData = data.map((item) => ({
    month: `${item.month.substring(0, 3)} ${item.year}`,
    total: item.totalAmount,
    paid: item.paidAmount,
    unpaid: item.unpaidAmount,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Expense Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
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
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ fontSize: '12px' }}
              />
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                name="Total"
                dot={{ r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="paid" 
                stroke="hsl(var(--chart-2))" 
                strokeWidth={2}
                name="Paid"
                dot={{ r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="unpaid" 
                stroke="hsl(var(--destructive))" 
                strokeWidth={2}
                name="Unpaid"
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}