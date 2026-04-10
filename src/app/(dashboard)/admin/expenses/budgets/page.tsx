'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, TrendingUp } from 'lucide-react';
import { useBudgets } from '@/lib/hooks/use-expenses';
import { BudgetUtilizationBar } from '@/components/expenses/budget-utilization-bar';
import type { BudgetFilters } from '@/lib/types/expense';
import { BudgetStatus, BudgetPeriod } from '@/lib/types/expense';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { BUDGET_STATUS_OPTIONS, BUDGET_PERIOD_OPTIONS } from '@/lib/constants/expense';

export default function BudgetsPage() {
  const [filters, setFilters] = useState<BudgetFilters>({
    page: 1,
    limit: 20,
  });

  const { data, isLoading } = useBudgets(filters);

  const budgets = data?.data?.budgets || [];
  const pagination = data?.data?.pagination;

  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Budget Management</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage expense budgets and utilization
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Budget
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={filters.status || 'all'}
              onValueChange={(value) => setFilters({ ...filters, status: (value === 'all' ? undefined : value) as BudgetStatus | undefined, page: 1 })}
            >
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {BUDGET_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Budget Period</Label>
            <Select
              value={filters.budgetPeriod || 'all'}
              onValueChange={(value) => setFilters({ ...filters, budgetPeriod: (value === 'all' ? undefined : value) as BudgetPeriod | undefined, page: 1 })}
            >
              <SelectTrigger>
                <SelectValue placeholder="All periods" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All periods</SelectItem>
                {BUDGET_PERIOD_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Budgets Grid */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      ) : budgets.length === 0 ? (
        <div className="text-center py-12">
          <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No budgets found</h3>
          <p className="text-muted-foreground mb-4">
            Get started by creating your first budget
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Budget
          </Button>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {budgets.map((budget) => (
              <BudgetUtilizationBar key={budget.id} budget={budget} />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}