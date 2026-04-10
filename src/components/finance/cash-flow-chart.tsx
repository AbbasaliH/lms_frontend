'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  ReferenceLine
} from 'recharts';
import { useCashFlow } from '@/lib/hooks/use-finance';
import { Loader2 } from 'lucide-react';
import type { CashFlowPeriod } from '@/lib/types/finance';

export function CashFlowChart() {
  const [period, setPeriod] = useState<CashFlowPeriod>('monthly');
  const { data, isLoading } = useCashFlow(period);

  const chartData = data?.data || [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Cash Flow Analysis</CardTitle>
            <CardDescription>Monitor cash inflows and outflows</CardDescription>
          </div>
          <Tabs value={period} onValueChange={(value) => setPeriod(value as CashFlowPeriod)}>
            <TabsList>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
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
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis 
                  dataKey="period" 
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
                    let label = 'Value';
                    if (name === 'inflow') label = 'Cash Inflow';
                    if (name === 'outflow') label = 'Cash Outflow';
                    if (name === 'netCashFlow') label = 'Net Cash Flow';
                    return [`₹${value.toLocaleString()}`, label];
                  }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                  formatter={(value) => {
                    if (value === 'inflow') return 'Cash Inflow';
                    if (value === 'outflow') return 'Cash Outflow';
                    return 'Net Cash Flow';
                  }}
                />
                <ReferenceLine y={0} stroke="hsl(var(--border))" />
                <Bar dataKey="inflow" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="outflow" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="netCashFlow" fill="hsl(var(--chart-4))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
