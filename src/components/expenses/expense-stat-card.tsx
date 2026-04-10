'use client';

import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExpenseStatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: number;
  icon: LucideIcon;
  iconColor?: string;
}

export function ExpenseStatCard({
  title,
  value,
  subtitle,
  trend,
  icon: Icon,
  iconColor = 'bg-primary/10 text-primary',
}: ExpenseStatCardProps) {
  const TrendIcon = trend && trend >= 0 ? TrendingUp : TrendingDown;
  const trendColor = trend && trend >= 0 ? 'text-success' : 'text-destructive';

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-1">
              {title}
            </p>
            <h3 className="text-3xl font-bold tracking-tight mb-1">
              {value}
            </h3>
            {subtitle && (
              <p className="text-xs text-muted-foreground">
                {subtitle}
              </p>
            )}
            {trend !== undefined && (
              <div className="flex items-center gap-1 mt-2">
                <TrendIcon className={cn('h-4 w-4', trendColor)} />
                <span className={cn('text-xs font-medium', trendColor)}>
                  {Math.abs(trend)}% from last month
                </span>
              </div>
            )}
          </div>
          <div className={cn('p-3 rounded-lg', iconColor)}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}