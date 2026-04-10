import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'success' | 'warning' | 'destructive';
}

export function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  trend,
  variant = 'default'
}: StatsCardProps) {
  // Variant styles for icon background and colors
  const variantStyles = {
    default: {
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      border: '',
    },
    success: {
      iconBg: 'bg-emerald-500/10',
      iconColor: 'text-emerald-500',
      border: 'border-emerald-500/20',
    },
    warning: {
      iconBg: 'bg-amber-500/10',
      iconColor: 'text-amber-500',
      border: 'border-amber-500/20',
    },
    destructive: {
      iconBg: 'bg-destructive/10',
      iconColor: 'text-destructive',
      border: 'border-destructive/20',
    },
  };

  const styles = variantStyles[variant];

  return (
    <Card className={cn('transition-all hover:shadow-md animate-in fade-in-50 slide-in-from-bottom-4 duration-500', styles.border)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn('rounded-lg p-2 transition-transform hover:scale-110', styles.iconBg)}>
          <Icon className={cn('h-4 w-4', styles.iconColor)} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend && (
          <div className="flex items-center gap-1 mt-2">
            <span
              className={cn(
                'text-xs font-medium',
                trend.isPositive ? 'text-emerald-500' : 'text-destructive'
              )}
            >
              {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
            </span>
            <span className="text-xs text-muted-foreground">from last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}