'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useBudgetComparison } from '@/lib/hooks/use-finance';
import { Loader2, TrendingDown, TrendingUp, Minus } from 'lucide-react';

export function BudgetComparisonChart() {
  const { data, isLoading } = useBudgetComparison();

  const chartData = data?.data || [];

  const getStatusBadge = (status: string, variance: number) => {
    if (status === 'under') {
      return (
        <Badge variant="outline" className="bg-success/10 text-success border-success/20">
          <TrendingDown className="mr-1 h-3 w-3" />
          Under Budget
        </Badge>
      );
    } else if (status === 'over') {
      return (
        <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
          <TrendingUp className="mr-1 h-3 w-3" />
          Over Budget
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-info/10 text-info border-info/20">
        <Minus className="mr-1 h-3 w-3" />
        On Track
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget vs Actual</CardTitle>
        <CardDescription>Compare actual spending against budgeted amounts by department</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-[400px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={chartData} 
                  layout="vertical"
                  margin={{ top: 5, right: 20, left: 100, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis 
                    type="number"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `₹${value / 1000}k`}
                  />
                  <YAxis 
                    type="category"
                    dataKey="department" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    width={90}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                    formatter={(value: number, name: string) => {
                      const label = name === 'budgeted' ? 'Budgeted' : 'Actual';
                      return [`₹${value.toLocaleString()}`, label];
                    }}
                  />
                  <Legend 
                    wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                    formatter={(value) => value === 'budgeted' ? 'Budgeted' : 'Actual Spending'}
                  />
                  <Bar dataKey="budgeted" fill="hsl(var(--muted))" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="actual" fill="hsl(var(--chart-1))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Department Summary</h4>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {chartData.map((dept, index) => (
                  <div key={index} className="rounded-lg border bg-card p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{dept.department}</span>
                      {getStatusBadge(dept.status, dept.variance)}
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Budgeted:</span>
                        <span className="font-medium">₹{dept.budgeted.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Actual:</span>
                        <span className="font-medium">₹{dept.actual.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between pt-1 border-t">
                        <span className="text-muted-foreground">Variance:</span>
                        <span className={`font-semibold ${dept.variance > 0 ? 'text-destructive' : 'text-success'}`}>
                          {dept.variance > 0 ? '+' : ''}₹{dept.variance.toLocaleString()} ({dept.variancePercent > 0 ? '+' : ''}{dept.variancePercent}%)
                        </span>
                      </div>
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
