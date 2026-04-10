'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/lib/utils/format';
import type { DepartmentSummary } from '@/lib/types/expense';

interface DepartmentBarChartProps {
  data: DepartmentSummary[];
}

export function DepartmentBarChart({ data }: DepartmentBarChartProps) {
  const chartData = data.map((item) => ({
    name: item.departmentName,
    amount: item.totalAmount,
    count: item.expenseCount,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            Amount: {formatCurrency(data.amount)}
          </p>
          <p className="text-sm text-muted-foreground">
            Expenses: {data.count}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expenses by Department</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical">
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
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="amount" 
                fill="hsl(var(--primary))"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}