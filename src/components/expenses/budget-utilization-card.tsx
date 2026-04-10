'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Edit, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Budget } from '@/lib/types/expense';
import { EXPENSE_CATEGORY_LABELS, BUDGET_STATUS_LABELS, BUDGET_STATUS_VARIANTS } from '@/lib/constants/expense';

interface BudgetUtilizationCardProps {
  budget: Budget;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function BudgetUtilizationCard({
  budget,
  onEdit,
  onDelete,
}: BudgetUtilizationCardProps) {
  const isNearThreshold = budget.utilizationPercentage >= budget.alertThreshold;
  const isExceeded = budget.utilizationPercentage > 100;
  
  const progressColor = isExceeded 
    ? 'bg-destructive' 
    : isNearThreshold 
    ? 'bg-warning' 
    : 'bg-success';

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold">
              {budget.name}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-muted-foreground">
                {EXPENSE_CATEGORY_LABELS[budget.category]}
              </span>
              {budget.department && (
                <>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">
                    {budget.department.name}
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Badge variant={BUDGET_STATUS_VARIANTS[budget.status]}>
              {BUDGET_STATUS_LABELS[budget.status]}
            </Badge>
            {onEdit && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={onEdit}
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive"
                onClick={onDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Status Alert */}
          {(isNearThreshold || isExceeded) && (
            <div className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-lg text-sm',
              isExceeded ? 'bg-destructive/10 text-destructive' : 'bg-warning/10 text-warning'
            )}>
              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
              <span className="font-medium">
                {isExceeded ? 'Budget Exceeded' : 'Near Threshold'}
              </span>
            </div>
          )}

          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress 
              value={Math.min(budget.utilizationPercentage, 100)} 
              className="h-2"
              indicatorClassName={progressColor}
            />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Spent: ₹{budget.spentAmount.toLocaleString('en-IN')} / ₹{budget.allocatedAmount.toLocaleString('en-IN')}
              </span>
              <span className="font-semibold">
                {budget.utilizationPercentage.toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">Remaining</p>
              <p className="font-semibold">
                ₹{budget.remainingAmount.toLocaleString('en-IN')}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Expenses</p>
              <p className="font-semibold">
                {budget.expenseCount || 0}
              </p>
            </div>
          </div>

          {/* Period */}
          <div className="text-xs text-muted-foreground">
            {new Date(budget.startDate).toLocaleDateString('en-IN', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })} - {new Date(budget.endDate).toLocaleDateString('en-IN', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}