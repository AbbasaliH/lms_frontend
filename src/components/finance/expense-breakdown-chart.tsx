'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';
import { useExpenseBreakdown } from '@/lib/hooks/use-finance';
import { Loader2 } from 'lucide-react';

export function ExpenseBreakdownChart() {
  const { data, isLoading } = useExpenseBreakdown();

  const chartData = data?.data || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Distribution</CardTitle>
        <CardDescription>Breakdown of expenses by category</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-[350px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-[1fr_300px]">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ percentage }) => `${percentage.toFixed(1)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="amount"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                    formatter={(value: number) => `₹${value.toLocaleString()}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Categories</h4>
              <div className="space-y-3">
                {chartData.map((entry, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div 
                        className="h-3 w-3 rounded-full" 
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="text-muted-foreground">{entry.category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">₹{entry.amount.toLocaleString()}</span>
                      <span className="text-xs text-muted-foreground">
                        ({entry.percentage}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
