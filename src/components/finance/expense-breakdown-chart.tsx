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

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  '#8884d8',
  '#82ca9d',
  '#ffc658',
  '#ff7300',
  '#00C49F',
];

export function ExpenseBreakdownChart() {
  const { data, isLoading } = useExpenseBreakdown();

  const rawData = data?.data || [];
  
  // Compute total for percentage calculation
  const totalAmount = rawData.reduce((sum, item) => sum + item.totalAmount, 0);
  
  // Map to chart-friendly format with percentages and colors
  const chartData = rawData.map((item, index) => ({
    category: item.category,
    totalAmount: item.totalAmount,
    count: item.count,
    percentage: totalAmount > 0 ? (item.totalAmount / totalAmount) * 100 : 0,
    color: COLORS[index % COLORS.length],
  }));

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
                    dataKey="totalAmount"
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
                    formatter={(value: number, name: string, props: any) => {
                      const item = chartData[props?.payload?.index ?? 0];
                      return [`₹${value.toLocaleString()} (${item?.percentage.toFixed(1)}%)`, item?.category || ''];
                    }}
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
                      <span className="font-medium">₹{entry.totalAmount.toLocaleString()}</span>
                      <span className="text-xs text-muted-foreground">
                        ({entry.percentage.toFixed(1)}%)
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
