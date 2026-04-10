'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Metric {
  label: string;
  value: number;
  target: number;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: number;
}

interface PerformanceMetricsProps {
  metrics?: Metric[];
}

const defaultMetrics: Metric[] = [
  {
    label: 'Order Fulfillment Rate',
    value: 94,
    target: 95,
    trend: 'up',
    trendValue: 2.5,
  },
  {
    label: 'Customer Satisfaction',
    value: 88,
    target: 90,
    trend: 'up',
    trendValue: 5.2,
  },
  {
    label: 'On-Time Delivery',
    value: 92,
    target: 95,
    trend: 'neutral',
    trendValue: 0.8,
  },
  {
    label: 'Revenue Growth',
    value: 78,
    target: 80,
    trend: 'up',
    trendValue: 12.4,
  },
];

export function PerformanceMetrics({ metrics = defaultMetrics }: PerformanceMetricsProps) {
  return (
    <Card className="animate-in fade-in-50 slide-in-from-bottom-4 duration-700">
      <CardHeader>
        <CardTitle>Performance Metrics</CardTitle>
        <CardDescription>Key performance indicators vs targets</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {metrics.map((metric) => {
          const percentage = (metric.value / metric.target) * 100;
          const isOnTarget = metric.value >= metric.target;
          
          return (
            <div key={metric.label} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">{metric.label}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>
                      {metric.value}% of {metric.target}% target
                    </span>
                    {metric.trend && metric.trendValue !== undefined && (
                      <span className="flex items-center gap-1">
                        {metric.trend === 'up' && (
                          <>
                            <TrendingUp className="h-3 w-3 text-emerald-500" />
                            <span className="text-emerald-500">+{metric.trendValue}%</span>
                          </>
                        )}
                        {metric.trend === 'down' && (
                          <>
                            <TrendingDown className="h-3 w-3 text-destructive" />
                            <span className="text-destructive">-{metric.trendValue}%</span>
                          </>
                        )}
                        {metric.trend === 'neutral' && (
                          <>
                            <Minus className="h-3 w-3 text-amber-500" />
                            <span className="text-amber-500">{metric.trendValue}%</span>
                          </>
                        )}
                      </span>
                    )}
                  </div>
                </div>
                <span
                  className={cn(
                    'text-lg font-bold',
                    isOnTarget ? 'text-emerald-500' : 'text-amber-500'
                  )}
                >
                  {metric.value}%
                </span>
              </div>
              <Progress 
                value={percentage} 
                className="h-2"
              />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
