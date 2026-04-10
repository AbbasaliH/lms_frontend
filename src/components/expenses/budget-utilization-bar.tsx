import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { formatCurrency, formatPercentage } from '@/lib/utils/format';
import { cn } from '@/lib/utils';
import type { Budget } from '@/lib/types/expense';

interface BudgetUtilizationBarProps {
  budget: Budget;
}

export function BudgetUtilizationBar({ budget }: BudgetUtilizationBarProps) {
  const {
    name,
    allocatedAmount = 0,
    spentAmount = 0,
    remainingAmount = 0,
    utilizationPercentage = 0,
    alertThreshold = 80,
    expenseCount = 0,
  } = budget;

  const isNearThreshold = utilizationPercentage >= alertThreshold && utilizationPercentage < 100;
  const isExceeded = utilizationPercentage >= 100;

  const getBarColor = () => {
    if (isExceeded) return 'bg-destructive';
    if (isNearThreshold) return 'bg-warning';
    return 'bg-primary';
  };

  const getTextColor = () => {
    if (isExceeded) return 'text-destructive';
    if (isNearThreshold) return 'text-warning';
    return 'text-primary';
  };

  return (
    <Card className={cn(
      'transition-all hover:shadow-md',
      isExceeded && 'border-destructive/50',
      isNearThreshold && 'border-warning/50'
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{name}</CardTitle>
          {(isNearThreshold || isExceeded) && (
            <div className={cn(
              'flex items-center gap-1 text-xs font-medium',
              getTextColor()
            )}>
              <AlertTriangle className="h-3 w-3" />
              <span>{isExceeded ? 'Exceeded' : 'Near Limit'}</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div
              className={cn('h-full transition-all duration-500', getBarColor())}
              style={{ width: `${Math.min(utilizationPercentage, 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              {formatCurrency(spentAmount)} of {formatCurrency(allocatedAmount)}
            </span>
            <span className={cn('font-bold', getTextColor())}>
              {formatPercentage(utilizationPercentage)}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t">
          <div>
            <div className="text-xs text-muted-foreground">Remaining</div>
            <div className="text-sm font-semibold">
              {formatCurrency(Math.max(0, remainingAmount))}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Expenses</div>
            <div className="text-sm font-semibold">{expenseCount || 0}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}