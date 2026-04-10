'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useFinancialRatios } from '@/lib/hooks/use-finance';
import { Loader2, TrendingUp, AlertTriangle, XCircle } from 'lucide-react';

export function FinancialRatiosSection() {
  const { data, isLoading } = useFinancialRatios();

  const ratios = data?.data || [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <TrendingUp className="h-4 w-4 text-success" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'critical':
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge className="bg-success text-success-foreground">Healthy</Badge>;
      case 'warning':
        return <Badge className="bg-warning text-warning-foreground">Warning</Badge>;
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Ratios & Health Indicators</CardTitle>
        <CardDescription>Key financial metrics for business health assessment</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-[200px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ratios.map((ratio, index) => (
              <div
                key={index}
                className="rounded-lg border bg-card p-4 space-y-3 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{ratio.name}</p>
                    <p className="text-xs text-muted-foreground">{ratio.description}</p>
                  </div>
                  {getStatusIcon(ratio.status)}
                </div>
                
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">{ratio.value.toFixed(2)}</span>
                  <span className="text-muted-foreground">{ratio.unit}</span>
                </div>

                {ratio.target && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Target: {ratio.target.toFixed(2)}{ratio.unit}</span>
                    {getStatusBadge(ratio.status)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
