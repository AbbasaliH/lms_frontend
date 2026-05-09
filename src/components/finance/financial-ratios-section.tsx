'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFinancialRatios } from '@/lib/hooks/use-finance';
import { Loader2, TrendingUp, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface RatioDef {
  key: string;
  title: string;
  description: string;
  target: string;
  format: 'ratio' | 'percent' | 'days';
  evaluate: (value: number) => 'good' | 'caution' | 'poor';
}

const RATIO_DEFINITIONS: RatioDef[] = [
  {
    key: 'currentRatio',
    title: 'Current Ratio',
    description: 'Current Assets / Current Liabilities',
    target: '1.5 - 2.0',
    format: 'ratio',
    evaluate: (v) => (v >= 1.5 && v <= 2.0 ? 'good' : v >= 1.0 ? 'caution' : 'poor'),
  },
  {
    key: 'debtToEquity',
    title: 'Debt to Equity',
    description: 'Total Debt / Total Equity',
    target: '< 0.5',
    format: 'ratio',
    evaluate: (v) => (v < 0.5 ? 'good' : v < 1.0 ? 'caution' : 'poor'),
  },
  {
    key: 'returnOnEquity',
    title: 'Return on Equity',
    description: 'Net Profit / Total Equity',
    target: '> 15%',
    format: 'percent',
    evaluate: (v) => (v > 15 ? 'good' : v > 8 ? 'caution' : 'poor'),
  },
  {
    key: 'inventoryTurnover',
    title: 'Inventory Turnover',
    description: 'COGS / Avg Inventory',
    target: '> 4',
    format: 'ratio',
    evaluate: (v) => (v > 4 ? 'good' : v > 2 ? 'caution' : 'poor'),
  },
  {
    key: 'daysReceivable',
    title: 'Days Receivable',
    description: 'Avg Collection Period',
    target: '< 30 days',
    format: 'days',
    evaluate: (v) => (v < 30 ? 'good' : v < 45 ? 'caution' : 'poor'),
  },
  {
    key: 'operatingMargin',
    title: 'Operating Margin',
    description: 'Operating Income / Revenue',
    target: '> 10%',
    format: 'percent',
    evaluate: (v) => (v > 10 ? 'good' : v > 5 ? 'caution' : 'poor'),
  },
  {
    key: 'profitMargin',
    title: 'Profit Margin',
    description: 'Net Profit / Revenue',
    target: '> 10%',
    format: 'percent',
    evaluate: (v) => (v > 10 ? 'good' : v > 5 ? 'caution' : 'poor'),
  },
  {
    key: 'expenseToRevenueRatio',
    title: 'Expense to Revenue',
    description: 'Total Expenses / Revenue',
    target: '< 60%',
    format: 'percent',
    evaluate: (v) => (v < 60 ? 'good' : v < 80 ? 'caution' : 'poor'),
  },
  {
    key: 'budgetUtilization',
    title: 'Budget Utilization',
    description: 'Spent / Budgeted',
    target: '< 90%',
    format: 'percent',
    evaluate: (v) => (v < 90 ? 'good' : v < 100 ? 'caution' : 'poor'),
  },
  {
    key: 'averageOrderValue',
    title: 'Avg Order Value',
    description: 'Revenue / Total Orders',
    target: 'Growing',
    format: 'ratio',
    evaluate: (v) => (v > 300 ? 'good' : v > 150 ? 'caution' : 'poor'),
  },
  {
    key: 'outstandingToRevenueRatio',
    title: 'Outstanding Ratio',
    description: 'Receivables / Revenue',
    target: '< 15%',
    format: 'percent',
    evaluate: (v) => (v < 15 ? 'good' : v < 25 ? 'caution' : 'poor'),
  },
];

const STATUS_STYLES = {
  good: 'bg-success/10 text-success border-success/20',
  caution: 'bg-warning/10 text-warning border-warning/20',
  poor: 'bg-destructive/10 text-destructive border-destructive/20',
};

const STATUS_LABELS = {
  good: 'Healthy',
  caution: 'Caution',
  poor: 'At Risk',
};

export function FinancialRatiosSection() {
  const { data, isLoading } = useFinancialRatios();

  const ratios = data?.data;

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!ratios) return null;

  // Build available ratio cards from actual data
  const availableCards = RATIO_DEFINITIONS
    .map((def) => {
      const value = (ratios as any)[def.key];
      if (typeof value !== 'number') return null;
      const status = def.evaluate(value);
      let displayValue: string;
      switch (def.format) {
        case 'days':
          displayValue = `${Math.round(value)} days`;
          break;
        case 'percent':
          displayValue = `${value.toFixed(2)}%`;
          break;
        default:
          displayValue = `${value.toFixed(2)}x`;
      }
      return { ...def, value, status, displayValue };
    })
    .filter(Boolean) as Array<RatioDef & { value: number; status: 'good' | 'caution' | 'poor'; displayValue: string }>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Financial Ratios</h2>
          <p className="text-muted-foreground">Key performance indicators and financial health metrics</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {availableCards.map((card) => (
          <Card key={card.key}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <Badge variant="outline" className={STATUS_STYLES[card.status]}>
                  {STATUS_LABELS[card.status]}
                </Badge>
              </div>
              <CardDescription>{card.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-3xl font-bold">{card.displayValue}</div>
                  <p className="text-xs text-muted-foreground mt-1">Target: {card.target}</p>
                </div>
                {card.status === 'poor' ? (
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                ) : card.status === 'caution' ? (
                  <AlertTriangle className="h-6 w-6 text-warning" />
                ) : (
                  <TrendingUp className="h-6 w-6 text-success" />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
