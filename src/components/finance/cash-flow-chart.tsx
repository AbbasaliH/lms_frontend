'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  ReferenceLine,
  Cell
} from 'recharts';
import { useCashFlow } from '@/lib/hooks/use-finance';
import { Loader2, TrendingUp, TrendingDown, Wallet } from 'lucide-react';

export function CashFlowChart() {
  const { data, isLoading } = useCashFlow();

  const cashFlow = data?.data;
  
  // Convert single object to array for chart display
  const chartData = cashFlow ? [
    { name: 'Cash Inflow', value: cashFlow.totalInflow, type: 'inflow' },
    { name: 'Cash Outflow', value: cashFlow.totalOutflow, type: 'outflow' },
    { name: 'Net Cash Flow', value: cashFlow.netCashFlow, type: 'net' },
  ] : [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Cash Flow Analysis</CardTitle>
            <CardDescription>Monitor cash inflows and outflows</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-[350px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : !cashFlow ? (
          <div className="flex h-[350px] items-center justify-center text-muted-foreground">
            No cash flow data available
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border bg-card p-4 space-y-2">
                <div className="flex items-center gap-2 text-success">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm font-medium">Cash Inflow</span>
                </div>
                <p className="text-2xl font-bold">₹{cashFlow.totalInflow.toLocaleString()}</p>
              </div>
              <div className="rounded-lg border bg-card p-4 space-y-2">
                <div className="flex items-center gap-2 text-destructive">
                  <TrendingDown className="h-4 w-4" />
                  <span className="text-sm font-medium">Cash Outflow</span>
                </div>
                <p className="text-2xl font-bold">₹{cashFlow.totalOutflow.toLocaleString()}</p>
              </div>
              <div className="rounded-lg border bg-card p-4 space-y-2">
                <div className="flex items-center gap-2 text-primary">
                  <Wallet className="h-4 w-4" />
                  <span className="text-sm font-medium">Net Cash Flow</span>
                </div>
                <p className={`text-2xl font-bold ${cashFlow.netCashFlow >= 0 ? 'text-success' : 'text-destructive'}`}>
                  ₹{cashFlow.netCashFlow.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis 
                    dataKey="name" 
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
                    formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']}
                  />
                  <Legend 
                    wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                  />
                  <ReferenceLine y={0} stroke="hsl(var(--border))" />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={
                          entry.type === 'inflow' 
                            ? 'hsl(var(--chart-3))' 
                            : entry.type === 'outflow' 
                              ? 'hsl(var(--chart-2))' 
                              : entry.value >= 0 
                                ? 'hsl(var(--chart-1))' 
                                : 'hsl(var(--destructive))'
                        } 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
