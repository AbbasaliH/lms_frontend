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
  Cell
} from 'recharts';

interface OrderDistributionChartProps {
  data?: Array<{
    category: string;
    orders: number;
    revenue: number;
  }>;
}

// Mock data for the chart
const mockData = [
  { category: 'Wash & Fold', orders: 320, revenue: 48000 },
  { category: 'Dry Cleaning', orders: 180, revenue: 54000 },
  { category: 'Ironing', orders: 145, revenue: 21750 },
  { category: 'Express', orders: 95, revenue: 28500 },
  { category: 'Alterations', orders: 48, revenue: 14400 },
];

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export function OrderDistributionChart({ data = mockData }: OrderDistributionChartProps) {
  return (
    <Card className="animate-in fade-in-50 slide-in-from-bottom-4 duration-700">
      <CardHeader>
        <CardTitle>Service Distribution</CardTitle>
        <CardDescription>Orders by service category</CardDescription>
      </CardHeader>
      <CardContent className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="category" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              angle={-15}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(value, name) => {
                const numValue = typeof value === 'number' ? value : 0;
                if (!numValue) return ['0', name || 'Value'];
                if (name === 'revenue') {
                  return [`₹${numValue.toLocaleString()}`, 'Revenue'];
                }
                return [numValue, 'Orders'];
              }}
            />
            <Legend 
              wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
              formatter={(value) => value === 'orders' ? 'Orders' : 'Revenue (₹)'}
            />
            <Bar dataKey="orders" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
